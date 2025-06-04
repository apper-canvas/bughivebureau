import React from 'react'
import ApperIcon from '../ApperIcon'

export const Avatar = ({ name, iconName = 'User', className = 'w-8 h-8', showIcon = true, showName = false }) => {
  const initial = name ? name.charAt(0) : 'U'
  const bgColor = `bg-gradient-to-br from-blue-500 to-purple-600` // Default

  return (
    <div className={`rounded-full flex items-center justify-center ${className} ${bgColor}`}>
      {showIcon && <ApperIcon name={iconName} className="w-4 h-4 text-white" />}
      {!showIcon && <span className="text-xs font-medium text-white">{initial}</span>}
      {showName && name && <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 hidden sm:block">{name}</span>}
    </div>
  )
}