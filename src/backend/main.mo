import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Bootstrap admin principal IDs (dev + live)
  let BOOTSTRAP_ADMINS : [Text] = [
    "aic5z-horrw-4jwce-ms65y-wcupc-tori5-ojc35-pyfit-3cwqh-cvcjo-zae",
  ];

  // Initialize bootstrap admins on first run
  stable var bootstrapDone : Bool = false;

  private func ensureBootstrapAdmins() {
    if (not bootstrapDone) {
      for (pid in BOOTSTRAP_ADMINS.vals()) {
        let p = Principal.fromText(pid);
        accessControlState.userRoles.add(p, #admin); accessControlState.adminAssigned := true;
      };
      bootstrapDone := true;
    };
  };

  // Run bootstrap on init
  do { ensureBootstrapAdmins() };

  // Stripe configuration
  stable var stripeSecretKey : Text = "";
  let stripeAllowedCountries : [Text] = ["US", "GB", "CA", "AU", "DE", "FR"];

  // Analytics
  stable var visitCount : Nat = 0;
  stable var totalSalesCount : Nat = 0;
  stable var totalRevenue : Nat = 0;

  // Authorized users list (tracked separately from role system)
  let authorizedUsers = Set.empty<Principal>();

  public func trackVisit() : async () {
    visitCount += 1;
  };

  public type Analytics = {
    visitCount : Nat;
    totalSalesCount : Nat;
    totalRevenue : Nat;
    registeredUsers : Nat;
    activeListings : Nat;
    authorizedUserCount : Nat;
  };

  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    let active = products.values().toArray().filter(func(p) { not p.isSold });
    {
      visitCount;
      totalSalesCount;
      totalRevenue;
      registeredUsers = userProfiles.size();
      activeListings = active.size();
      authorizedUserCount = authorizedUsers.size();
    };
  };

  public shared ({ caller }) func addAuthorizedUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add authorized users");
    };
    authorizedUsers.add(user);
    // Also grant #user role so they can perform actions
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public shared ({ caller }) func removeAuthorizedUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove authorized users");
    };
    authorizedUsers.remove(user);
    // Demote back to guest
    AccessControl.assignRole(accessControlState, caller, user, #guest);
  };

  public query ({ caller }) func getAuthorizedUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list authorized users");
    };
    authorizedUsers.toArray();
  };

  public shared ({ caller }) func setStripeSecretKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set the Stripe key");
    };
    stripeSecretKey := key;
  };

  public query func transformResponse(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createStripeCheckoutSession(productId : Nat, successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    if (stripeSecretKey == "") {
      Runtime.trap("Stripe is not configured yet");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    if (product.isSold) {
      Runtime.trap("Product is already sold");
    };
    let priceWithFee : Nat = product.price * 103 / 100;
    let item : Stripe.ShoppingItem = {
      currency = "usd";
      productName = product.title;
      productDescription = product.description;
      priceInCents = priceWithFee;
      quantity = 1;
    };
    let config : Stripe.StripeConfiguration = {
      secretKey = stripeSecretKey;
      allowedCountries = stripeAllowedCountries;
    };
    let url = await Stripe.createCheckoutSession(config, caller, [item], successUrl, cancelUrl, transformResponse);
    let pattern = "\"url\":\"";
    if (url.contains(#text pattern)) {
      let parts = url.split(#text pattern);
      switch (parts.next()) {
        case (null) { Runtime.trap("Failed to parse Stripe response") };
        case (?_) {
          switch (parts.next()) {
            case (?afterPattern) {
              switch (afterPattern.split(#text "\"").next()) {
                case (?checkoutUrl) { checkoutUrl };
                case (null) { Runtime.trap("Failed to extract checkout URL") };
              };
            };
            case (null) { Runtime.trap("Failed to extract checkout URL") };
          };
        };
      };
    } else {
      Runtime.trap("Stripe did not return a checkout URL");
    };
  };

  public shared ({ caller }) func verifyStripePayment(sessionId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify payments");
    };
    if (stripeSecretKey == "") {
      return false;
    };
    let config : Stripe.StripeConfiguration = {
      secretKey = stripeSecretKey;
      allowedCountries = stripeAllowedCountries;
    };
    let status = await Stripe.getSessionStatus(config, sessionId, transformResponse);
    switch (status) {
      case (#completed({ response; userPrincipal })) { true };
      case (#failed(_)) { false };
    };
  };

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Categories
  type ProductCategory = {
    #electronics;
    #fashion;
    #home;
    #sports;
    #hobbies;
    #autos;
  };

  module ProductCategory {
    public func compare(cat1 : ProductCategory, cat2 : ProductCategory) : Order.Order {
      switch (cat1, cat2) {
        case (#electronics, #electronics) { #equal };
        case (#electronics, _) { #less };
        case (#fashion, #fashion) { #equal };
        case (#fashion, #electronics) { #greater };
        case (#fashion, _) { #less };
        case (#home, #home) { #equal };
        case (#home, #autos) { #greater };
        case (#home, _) { #less };
        case (#sports, #sports) { #equal };
        case (#sports, #autos) { #greater };
        case (#sports, _) { #less };
        case (#hobbies, #hobbies) { #equal };
        case (#hobbies, #autos) { #greater };
        case (#hobbies, _) { #less };
        case (#autos, #autos) { #equal };
        case (#autos, _) { #greater };
      };
    };
  };

  type Product = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : ProductCategory;
    imageUrl : Text;
    seller : Principal;
    isSold : Bool;
    createdAt : Time.Time;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func compareByCategory(product1 : Product, product2 : Product) : Order.Order {
      switch (ProductCategory.compare(product1.category, product2.category)) {
        case (#equal) { Nat.compare(product1.id, product2.id) };
        case (order) { order };
      };
    };
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  public shared ({ caller }) func createProduct(title : Text, description : Text, price : Nat, category : ProductCategory, imageUrl : Text, sellerId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can create products");
    };
    let product : Product = {
      id = nextProductId;
      title;
      description;
      price;
      category;
      imageUrl;
      seller = caller;
      isSold = false;
      createdAt = Time.now();
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, title : Text, description : Text, price : Nat, category : ProductCategory, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.seller != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admin can update this product");
        };
        products.add(id, { product with title; description; price; category; imageUrl });
      };
    };
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProductsSorted() : async [Product] {
    products.values().toArray().sort(Product.compareByCategory);
  };

  public query ({ caller }) func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func getMyProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their products");
    };
    products.values().toArray().filter(func(p) { p.seller == caller });
  };

  public shared ({ caller }) func markProductAsSold(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark products as sold");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.seller != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admin can mark this product as sold");
        };
        products.add(id, { product with isSold = true });
        // Track analytics
        totalSalesCount += 1;
        totalRevenue += product.price;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.seller != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admin can delete this product");
        };
        products.remove(id);
      };
    };
  };

  // Reviews
  type Review = {
    productId : Nat;
    reviewer : Principal;
    rating : Nat;
    comment : Text;
    timestamp : Time.Time;
  };

  let reviews = Map.empty<Nat, List.List<Review>>();

  public shared ({ caller }) func addReview(productId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let existingList = switch (reviews.get(productId)) {
      case (null) { List.empty<Review>() };
      case (?list) { list };
    };
    var alreadyReviewed = false;
    for (r in existingList.toArray().vals()) {
      if (r.reviewer == caller) { alreadyReviewed := true };
    };
    if (alreadyReviewed) {
      Runtime.trap("You have already reviewed this product");
    };
    let review : Review = {
      productId;
      reviewer = caller;
      rating;
      comment;
      timestamp = Time.now();
    };
    existingList.add(review);
    reviews.add(productId, existingList);
  };

  public query func getReviewsByProduct(productId : Nat) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  // Verified Sellers
  let manuallyVerifiedSellers = Set.empty<Principal>();

  public shared ({ caller }) func setSellerVerified(seller : Principal, verified : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set verified status");
    };
    if (verified) {
      manuallyVerifiedSellers.add(seller);
    } else {
      manuallyVerifiedSellers.remove(seller);
    };
  };

  public query func getManuallyVerifiedSellers() : async [Principal] {
    manuallyVerifiedSellers.toArray();
  };

  // Chat
  type MarketPlaceMessage = {
    productId : Nat;
    sender : Text;
    text : Text;
    timestamp : Time.Time;
  };

  let marketplaceMessages = Map.empty<Nat, List.List<MarketPlaceMessage>>();

  public shared ({ caller }) func sendMarketPlaceMessage(productId : Nat, sender : Text, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let message : MarketPlaceMessage = {
      productId;
      sender;
      text;
      timestamp = Time.now();
    };
    let existingMessages = switch (marketplaceMessages.get(productId)) {
      case (null) { List.empty<MarketPlaceMessage>() };
      case (?messages) { messages };
    };
    existingMessages.add(message);
    marketplaceMessages.add(productId, existingMessages);
  };

  public query ({ caller }) func getMarketPlaceMessagesByProduct(productId : Nat) : async [MarketPlaceMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    switch (marketplaceMessages.get(productId)) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  // Support Chat
  type SupportMessage = {
    sender : Text;
    text : Text;
    timestamp : Time.Time;
  };

  let supportMessages = List.empty<SupportMessage>();

  public shared ({ caller }) func sendSupportMessage(sender : Text, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send support messages");
    };
    let message : SupportMessage = {
      sender;
      text;
      timestamp = Time.now();
    };
    supportMessages.add(message);
  };

  public query ({ caller }) func getSupportMessages() : async [SupportMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view support messages");
    };
    supportMessages.toArray();
  };

  public query ({ caller }) func getProductCategories() : async [ProductCategory] {
    [#electronics, #fashion, #home, #sports, #hobbies, #autos];
  };
};
