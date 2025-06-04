import React from 'react'
import ApperIcon from '../ApperIcon'
import { Input } from '../atoms/Input'

export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative hidden md:block">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-64"
        icon={ApperIcon}
        iconClassName="text-gray-400 w-4 h-4"
      />
    </div>
  )
}