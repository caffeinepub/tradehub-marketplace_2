import { Car, Cpu, Dumbbell, Gamepad2, Home, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { ProductCategory } from "../hooks/useQueries";

const CATEGORIES = [
  {
    label: "Electronics",
    value: ProductCategory.electronics,
    icon: Cpu,
    color: "text-blue-600",
    activeBg: "bg-blue-600",
    inactiveBg: "bg-blue-50",
  },
  {
    label: "Home",
    value: ProductCategory.home,
    icon: Home,
    color: "text-orange-600",
    activeBg: "bg-orange-500",
    inactiveBg: "bg-orange-50",
  },
  {
    label: "Fashion",
    value: ProductCategory.fashion,
    icon: Shirt,
    color: "text-pink-600",
    activeBg: "bg-pink-600",
    inactiveBg: "bg-pink-50",
  },
  {
    label: "Sports",
    value: ProductCategory.sports,
    icon: Dumbbell,
    color: "text-green-600",
    activeBg: "bg-green-600",
    inactiveBg: "bg-green-50",
  },
  {
    label: "Hobbies",
    value: ProductCategory.hobbies,
    icon: Gamepad2,
    color: "text-purple-600",
    activeBg: "bg-purple-600",
    inactiveBg: "bg-purple-50",
  },
  {
    label: "Autos",
    value: ProductCategory.autos,
    icon: Car,
    color: "text-red-600",
    activeBg: "bg-red-600",
    inactiveBg: "bg-red-50",
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
              className={`flex flex-col items-center gap-2.5 py-5 px-2 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-transparent shadow-card"
                  : "border-border bg-white hover:border-primary/40 hover:shadow-xs"
              }`}
              data-ocid="category.tab"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? `${cat.activeBg} text-white shadow-sm`
                    : `${cat.inactiveBg} ${cat.color}`
                }`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
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
