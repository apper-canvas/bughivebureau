import React from 'react'

export const Text = ({ children, className, variant = 'p' }) => {
  const tagMapping = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    label: 'label',
    error: 'div',
    badge: 'span',
    mono: 'span'
  }
  
  const Component = tagMapping[variant] || 'p'
  const baseClasses = {
    h1: 'text-xl font-bold text-gray-900 dark:text-white',
    h2: 'text-lg font-semibold text-gray-900 dark:text-white',
    h3: 'text-sm font-medium text-gray-900 dark:text-white truncate',
    p: 'text-sm text-gray-500 dark:text-gray-400',
    span: 'text-sm font-medium text-white',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    error: 'mt-1 text-sm text-red-600 dark:text-red-400 flex items-center',
    badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    mono: 'text-sm font-mono text-gray-500 dark:text-gray-400'
  }

  return (
    <Component className={`${baseClasses[variant]} ${className || ''}`}>
      {children}
    </Component>
  )
}