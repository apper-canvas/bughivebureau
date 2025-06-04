import React from 'react'
import ApperIcon from '../ApperIcon'

export const Toggle = ({ isOn, onToggle, onIcon, offIcon, className }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${className}`}
    >
      <ApperIcon name={isOn ? onIcon : offIcon} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </button>
  )
}