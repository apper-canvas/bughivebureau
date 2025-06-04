import React from 'react'
import ApperIcon from '../ApperIcon'
import { Button } from '../atoms/Button'
import { Dropdown } from '../molecules/Dropdown'
import { FormField } from '../molecules/FormField'

export const FilterSection = ({ filters, onFilterChange, onNewTicketClick }) => {
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'testing', label: 'Testing' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Dropdown
          label="Priority"
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          options={priorityOptions}
        />
        
        <Dropdown
          label="Status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={statusOptions}
        />
        
        <FormField
          label="Assignee"
          type="text"
          placeholder="Filter by assignee..."
          value={filters.assignee}
          onChange={(e) => onFilterChange('assignee', e.target.value)}
        />
        
        <div className="flex items-end">
          <Button
            onClick={onNewTicketClick}
            className="w-full bg-primary hover:bg-primary-dark text-white"
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            New Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}