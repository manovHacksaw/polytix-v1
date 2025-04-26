"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";



export function ErrorMessage({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center"
        >
          <AlertCircle className="h-4 w-4 inline mr-1 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}