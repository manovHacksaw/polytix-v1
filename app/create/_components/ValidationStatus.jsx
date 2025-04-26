"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";


export function ValidationStatus({ isValid }) {
  if (!isValid) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-xs text-green-600 dark:text-green-400 flex items-center"
    >
      <CheckCircle2 className="h-3 w-3 mr-1" /> Valid
    </motion.span>
  );
}