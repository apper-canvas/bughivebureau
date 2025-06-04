import React from 'react'
import { Label } from '../atoms/Label'

export const Dropdown = ({ label, value, onChange, options, className }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary ${className}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}