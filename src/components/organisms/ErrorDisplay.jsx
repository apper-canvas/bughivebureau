import React from 'react'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'

export const ErrorDisplay = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <Text variant="h2" className="mb-2">Error Loading Tickets</Text>
        <Text variant="p">{message}</Text>
      </div>
    </div>
  )
}