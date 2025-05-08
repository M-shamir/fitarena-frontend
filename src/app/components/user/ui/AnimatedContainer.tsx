'use client'
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function AnimatedContainer({ 
  children, 
  className = '', 
  delay = 0, 
  once = true 
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
}