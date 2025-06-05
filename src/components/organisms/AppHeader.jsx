import React from 'react'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Toggle } from '../atoms/Toggle'
import { SearchInput } from '../molecules/SearchInput'
import { Avatar } from '../molecules/Avatar'

export const AppHeader = ({ appName, searchFilter, onSearchChange, darkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
<ApperIcon name="Bug" className="w-5 h-5 text-white" />
            </div>
            <Text variant="h1">{appName}</Text>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              Dashboard
            </a>
            <a href="/test-cases" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              Test Cases
            </a>
          </nav>
        </div>
          
          <div className="flex items-center space-x-4">
            <SearchInput
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets..."
            />
            
            <Toggle
              isOn={darkMode}
              onToggle={onToggleDarkMode}
              onIcon="Sun"
              offIcon="Moon"
            />
            
            <Avatar />
          </div>
        </div>
      </div>
    </header>
  )
}