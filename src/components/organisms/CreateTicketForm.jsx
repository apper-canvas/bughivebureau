import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'
import { FormField } from '../molecules/FormField'
import { RadioButton } from '../molecules/RadioButton'
import { Button } from '../atoms/Button'
import { ProgressBar } from '../molecules/ProgressBar'
import { Text } from '../atoms/Text'
import { Spinner } from '../atoms/Spinner'
import { ticketService, userService } from '../../services'

export const CreateTicketForm = ({ isOpen, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: ''
  })
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        try {
          const userList = await userService.getAll()
          setUsers(userList || [])
        } catch (error) {
          console.error('Failed to load users:', error)
        }
      }
      loadUsers()
    }
  }, [isOpen])

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required'
      if (!formData.description.trim()) newErrors.description = 'Description is required'
      if (!formData.priority) newErrors.priority = 'Priority is required'
    }
    
    if (step === 2) {
      if (!formData.stepsToReproduce.trim()) newErrors.stepsToReproduce = 'Steps to reproduce are required'
      if (!formData.expectedBehavior.trim()) newErrors.expectedBehavior = 'Expected behavior is required'
      if (!formData.actualBehavior.trim()) newErrors.actualBehavior = 'Actual behavior is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(2)) return
    
    setLoading(true)
    try {
      const assignee = users.find(user => user.id === formData.assignee) || null
      const reporter = users[0] || { id: 'current-user', name: 'Current User', email: 'user@example.com' }
      
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: 'new',
        assignee,
        reporter,
        stepsToReproduce: formData.stepsToReproduce.trim(),
        expectedBehavior: formData.expectedBehavior.trim(),
        actualBehavior: formData.actualBehavior.trim(),
        attachments: []
      }
      
      const newTicket = await ticketService.create(ticketData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: ''
      })
      setCurrentStep(1)
      setErrors({})
      
      onTicketCreated(newTicket)
      toast.success('Ticket created successfully!')
      
    } catch (error) {
      toast.error('Failed to create ticket: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: ''
    })
    setCurrentStep(1)
    setErrors({})
    onClose()
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return { icon: 'AlertTriangle', color: 'text-red-500' }
      case 'high': return { icon: 'ArrowUp', color: 'text-orange-500' }
      case 'medium': return { icon: 'Minus', color: 'text-blue-500' }
      case 'low': return { icon: 'ArrowDown', color: 'text-gray-500' }
      default: return { icon: 'Minus', color: 'text-gray-500' }
    }
  }

  const progress = currentStep === 1 ? 50 : 100
  const stepTitle = currentStep === 1 ? 'Basic Information' : 'Technical Details'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
                    Create New Ticket
                  </h2>
                  <Text variant="p" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Step {currentStep} of 2 - {stepTitle}
                  </Text>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <ProgressBar progress={progress} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        label="Ticket Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter a clear, descriptive title for the bug"
                        error={errors.title}
                      />

                      <FormField
                        label="Description"
                        required
                        type="textarea"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide a detailed description of the issue"
                        error={errors.description}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Text variant="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priority <span className="text-red-500">*</span>
                          </Text>
                          <div className="space-y-2">
                            {['critical', 'high', 'medium', 'low'].map((priority) => {
                              const { icon, color } = getPriorityIcon(priority)
                              return (
                                <RadioButton
                                  key={priority}
                                  name="priority"
                                  value={priority}
                                  checked={formData.priority === priority}
                                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                  label={priority}
                                  icon={icon}
                                  iconColor={color}
                                />
                              )
                            })}
                          </div>
                          {errors.priority && (
                            <Text variant="error">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                              {errors.priority}
                            </Text>
                          )}
                        </div>

                        <div>
                          <Text variant="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assign to
                          </Text>
                          <select
                            value={formData.assignee}
                            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        label="Steps to Reproduce"
                        required
                        type="textarea"
                        rows={4}
                        value={formData.stepsToReproduce}
                        onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                        placeholder="1. Go to the login page&#10;2. Enter invalid credentials&#10;3. Click submit"
                        error={errors.stepsToReproduce}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Expected Behavior"
                          required
                          type="textarea"
                          rows={4}
                          value={formData.expectedBehavior}
                          onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                          placeholder="Describe what should happen"
                          error={errors.expectedBehavior}
                        />

                        <FormField
                          label="Actual Behavior"
                          required
                          type="textarea"
                          rows={4}
                          value={formData.actualBehavior}
                          onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                          placeholder="Describe what actually happens"
                          error={errors.actualBehavior}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
{/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="flex justify-between">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={handlePrev}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium px-0 py-0 flex items-center"
                      >
                        <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={handleClose}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium px-0 py-0"
                    >
                      Cancel
                    </Button>
                    
                    {currentStep < 2 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary-dark text-white flex items-center"
                      >
                        Next
                        <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-secondary hover:bg-secondary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <Spinner className="h-4 w-4 border-b-2 border-white mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                            Create Ticket
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}