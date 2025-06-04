import React from 'react'

export const Spinner = ({ className = 'h-4 w-4 border-b-2 border-primary mr-2' }) => {
  return (
    <div className={`animate-spin rounded-full ${className}`}></div>
  )
}