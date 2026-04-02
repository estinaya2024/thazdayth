import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  label, 
  icon: Icon, 
  onClick 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all w-full text-left group"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/10 text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </motion.button>
  );
};

export default QuickActionButton;
