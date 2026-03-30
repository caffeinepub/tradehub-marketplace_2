import { Car, Cpu, Dumbbell, Gamepad2, Home, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { ProductCategory } from "../hooks/useQueries";

const CATEGORIES = [
  {
    label: "Electronics",
    value: ProductCategory.electronics,
    icon: Cpu,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Home",
    value: ProductCategory.home,
    icon: Home,
    color: "text-orange-600 bg-orange-50",
  },
  {
    label: "Fashion",
    value: ProductCategory.fashion,
    icon: Shirt,
    color: "text-pink-600 bg-pink-50",
  },
  {
    label: "Sports",
    value: ProductCategory.sports,
    icon: Dumbbell,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Hobbies",
    value: ProductCategory.hobbies,
    icon: Gamepad2,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Autos",
    value: ProductCategory.autos,
    icon: Car,
    color: "text-red-600 bg-red-50",
  },
];

interface CategoryPicksProps {
  selected: ProductCategory | null;
  onSelect: (cat: ProductCategory | null) => void;
}

export default function CategoryPicks({
  selected,
  onSelect,
}: CategoryPicksProps) {
  return (
    <section className="py-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Browse by Category
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const isActive = selected === cat.value;
          return (
            <motion.button
              key={cat.value}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(isActive ? null : cat.value)}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-primary bg-secondary shadow-card"
                  : "border-border bg-white hover:border-primary/40 hover:shadow-xs"
              }`}
              data-ocid="category.tab"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground"}`}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
