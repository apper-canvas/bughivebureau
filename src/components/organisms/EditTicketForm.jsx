import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { FormField } from '../molecules/FormField'
import { Dropdown } from '../molecules/Dropdown'
import ticketService from '../../services/api/ticketService'
import userService from '../../services/api/userService'

export const EditTicketForm = ({ ticket, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: ticket.title || '',
    description: ticket.description || '',
    priority: ticket.priority || 'medium',
    status: ticket.status || 'new',
    assigneeId: ticket.assignee?.id || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  React.useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        const userData = await userService.getAll()
        setUsers(userData)
      } catch (error) {
        toast.error('Failed to load users')
      } finally {
        setLoadingUsers(false)
      }
    }
    loadUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assigneeId ? users.find(u => u.id === formData.assigneeId) : null
      }

      const updatedTicket = await ticketService.update(ticket.id, updateData)
      toast.success('Ticket updated successfully!')
      onSuccess(updatedTicket)
    } catch (error) {
      toast.error('Failed to update ticket. Please try again.')
      console.error('Error updating ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'testing', label: 'Testing' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Text variant="h2" className="text-xl font-semibold">
          Edit Ticket #{ticket.id}
        </Text>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!formData.title || !formData.description}
          >
            Update Ticket
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Title" required>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter ticket title"
            disabled={loading}
            required
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the issue in detail"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Priority">
            <Dropdown
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
              placeholder="Select priority"
              disabled={loading}
            />
          </FormField>

          <FormField label="Status">
            <Dropdown
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              placeholder="Select status"
              disabled={loading}
            />
          </FormField>

          <FormField label="Assignee">
            <Dropdown
              options={[{ value: '', label: 'Unassigned' }, ...userOptions]}
              value={formData.assigneeId}
              onChange={(value) => handleInputChange('assigneeId', value)}
              placeholder={loadingUsers ? "Loading users..." : "Select assignee"}
              disabled={loading || loadingUsers}
            />
          </FormField>
        </div>
      </form>
    </motion.div>
  )
}