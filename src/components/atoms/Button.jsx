import React from 'react'

export const Button = ({ children, className, type = 'button', onClick, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-medium transition-all-smooth hover:shadow-card ${className}`}
    >
      {children}
    </button>
  )
}