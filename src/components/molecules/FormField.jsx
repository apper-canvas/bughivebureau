import React from 'react'
import { Label } from '../atoms/Label'
import { Input } from '../atoms/Input'
import { Text } from '../atoms/Text'
import ApperIcon from '../ApperIcon'

export const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  rows,
  required,
  error,
  icon
}) => {
  return (
    <div>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        hasError={!!error}
        icon={icon}
      />
      {error && (
        <Text variant="error">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </Text>
      )}
    </div>
  )
}