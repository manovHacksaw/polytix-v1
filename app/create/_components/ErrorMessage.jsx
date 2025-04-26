"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        transition={{ duration: 0.2 }}
        className="text-sm text-red-500 flex items-start gap-1"
      >
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </motion.p>
    </AnimatePresence>
  );
}