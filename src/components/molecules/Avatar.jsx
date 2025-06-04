import React from 'react'
import ApperIcon from '../ApperIcon'

export const Avatar = ({ name, iconName = 'User', className = 'w-8 h-8', showIcon = true, showName = false }) => {
  const initial = name ? name.charAt(0) : 'U'
const bgColor = `bg-gradient-to-br from-blue-500 to-purple-600` // Default

return (
    <div className={`flex items-center ${showName ? 'space-x-2' : ''}`}>
      <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${className} ${bgColor}`}>
        {showIcon && <ApperIcon name={iconName} className="w-4 h-4 text-white flex-shrink-0" />}
        {!showIcon && <span className="text-xs font-medium text-white flex-shrink-0">{initial}</span>}
      </div>
      {showName && name && (
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {name}
        </span>
      )}
    </div>
  )
}