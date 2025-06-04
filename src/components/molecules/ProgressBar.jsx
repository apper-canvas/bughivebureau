import React from 'react'
import { motion } from 'framer-motion'

export const ProgressBar = ({ progress, className }) => {
  return (
    <div className={`mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <motion.div
        className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </div>
  )
}