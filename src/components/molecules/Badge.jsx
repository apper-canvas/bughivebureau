import React from 'react'
import { Text } from '../atoms/Text'

export const Badge = ({ children, colorClass, className = "" }) => {
  return (
    <Text variant="badge" className={`${colorClass} ${className} font-medium`}>
      {children}
    </Text>
  )
}