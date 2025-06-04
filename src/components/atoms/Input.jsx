import React from 'react'

export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  rows,
  hasError,
  icon: Icon,
  iconClassName
}) => {
  const baseClasses = `w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth`
  const errorClasses = hasError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
  const combinedClasses = `${baseClasses} ${errorClasses} ${className || ''}`

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`${combinedClasses} resize-none`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div className="relative">
      {Icon && (
        <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClassName || 'text-gray-400 w-4 h-4'}`} />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${combinedClasses} ${Icon ? 'pl-10 pr-4' : 'px-3'}`}
      />
    </div>
  )
}