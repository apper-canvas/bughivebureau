import React from 'react'
import ApperIcon from '../ApperIcon'
import { Button } from '../atoms/Button'
import { Dropdown } from '../molecules/Dropdown'
import { FormField } from '../molecules/FormField'

export const FilterSection = ({ filters, onFilterChange, onNewTicketClick, onViewChange, currentView }) => {
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="view-toggle">
          <button
            onClick={() => onViewChange('list')}
            className={`view-toggle-button ${currentView === 'list' ? 'active' : 'inactive'}`}
          >
            <ApperIcon name="List" className="w-4 h-4 inline mr-2" />
            List
          </button>
          <button
            onClick={() => onViewChange('kanban')}
            className={`view-toggle-button ${currentView === 'kanban' ? 'active' : 'inactive'}`}
          >
            <ApperIcon name="Columns" className="w-4 h-4 inline mr-2" />
            Kanban
          </button>
        </div>
        
        <Button
          onClick={onNewTicketClick}
          className="bg-primary hover:bg-primary-dark text-white whitespace-nowrap"
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}