import { ArrowRight, ChevronRight, Menu, Star, X } from "lucide-react";
import { motion } from "framer-motion";
export default function SmallStars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < n ? "opacity-100" : "opacity-30"}`}
        />
      ))}
    </div>
  );
}
