import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { ticketService, userService } from '../services'

export default function MainFeature({ isOpen, onClose, onTicketCreated }) {
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

  // Load users when modal opens
  useState(() => {
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Step {currentStep} of 2 - {currentStep === 1 ? 'Basic Information' : 'Technical Details'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full"
                  initial={{ width: '50%' }}
                  animate={{ width: currentStep === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </div>
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
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ticket Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth ${
                            errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter a clear, descriptive title for the bug"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth resize-none ${
                            errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Provide a detailed description of the issue"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                            {errors.description}
                          </p>
                        )}
                      </div>

                      {/* Priority and Assignee */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priority *
                          </label>
                          <div className="space-y-2">
                            {['critical', 'high', 'medium', 'low'].map((priority) => {
                              const { icon, color } = getPriorityIcon(priority)
                              return (
                                <label key={priority} className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    value={priority}
                                    checked={formData.priority === priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="sr-only"
                                  />
                                  <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-all-smooth ${
                                    formData.priority === priority
                                      ? 'border-primary bg-primary/5'
                                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                  }`}>
                                    <ApperIcon name={icon} className={`w-4 h-4 ${color}`} />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                      {priority}
                                    </span>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                          {errors.priority && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                              {errors.priority}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assign to
                          </label>
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
                      {/* Steps to Reproduce */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Steps to Reproduce *
                        </label>
                        <textarea
                          value={formData.stepsToReproduce}
                          onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                          rows={4}
                          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth resize-none ${
                            errors.stepsToReproduce ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="1. Go to the login page&#10;2. Enter invalid credentials&#10;3. Click submit"
                        />
                        {errors.stepsToReproduce && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                            {errors.stepsToReproduce}
                          </p>
                        )}
                      </div>

                      {/* Expected vs Actual Behavior */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expected Behavior *
                          </label>
                          <textarea
                            value={formData.expectedBehavior}
                            onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                            rows={4}
                            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth resize-none ${
                              errors.expectedBehavior ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Describe what should happen"
                          />
                          {errors.expectedBehavior && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                              {errors.expectedBehavior}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Actual Behavior *
                          </label>
                          <textarea
                            value={formData.actualBehavior}
                            onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                            rows={4}
                            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all-smooth resize-none ${
                              errors.actualBehavior ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Describe what actually happens"
                          />
                          {errors.actualBehavior && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                              {errors.actualBehavior}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="flex justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors flex items-center"
                      >
                        <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    
                    {currentStep < 2 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all-smooth hover:shadow-card flex items-center"
                      >
                        Next
                        <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg transition-all-smooth hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                            Create Ticket
                          </>
                        )}
                      </button>
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