import React from 'react'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'

export const RadioButton = ({ name, value, checked, onChange, label, icon: Icon, iconColor }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-all-smooth ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}>
        {Icon && <ApperIcon name={Icon} className={`w-4 h-4 ${iconColor}`} />}
        <Text variant="span" className="text-sm font-medium text-gray-900 dark:text-white capitalize">
          {label}
        </Text>
      </div>
    </label>
  )
}