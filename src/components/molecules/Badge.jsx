import React from 'react'
import { Text } from '../atoms/Text'

export const Badge = ({ children, colorClass }) => {
  return (
    <Text variant="badge" className={`${colorClass}`}>
      {children}
    </Text>
  )
}