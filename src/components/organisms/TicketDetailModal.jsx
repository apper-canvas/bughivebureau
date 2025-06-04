import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'
import { Button } from '../atoms/Button'
import { EditTicketForm } from './EditTicketForm'
export const TicketDetailModal = ({ ticket, onClose, getPriorityColor, getStatusColor, onTicketUpdate, onTicketDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(ticket)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!currentTicket) return null
  const handleEditSuccess = (updatedTicket) => {
    setCurrentTicket(updatedTicket)
    setIsEditing(false)
    if (onTicketUpdate) {
      onTicketUpdate(updatedTicket)
    }
}

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleDelete = async () => {
    if (!onTicketDelete) return
    
    setDeleting(true)
    try {
      await onTicketDelete(currentTicket.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete ticket:', error)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
<AnimatePresence>
      {currentTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {isEditing ? (
                <EditTicketForm
                  ticket={currentTicket}
                  onSuccess={handleEditSuccess}
                  onCancel={handleEditCancel}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Text variant="mono">#{currentTicket.id}</Text>
                        <Badge colorClass={getPriorityColor(currentTicket.priority)}>
                          {currentTicket.priority}
                        </Badge>
                        <Badge colorClass={getStatusColor(currentTicket.status)}>
                          {currentTicket.status?.replace('-', ' ')}
                        </Badge>
                      </div>
                      <Text variant="h2" className="text-xl font-semibold">
                        {currentTicket.title}
                      </Text>
                    </div>
<div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
              
<div className="space-y-6">
                    <div>
                      <Text variant="label">Description</Text>
                      <p className="text-gray-900 dark:text-white">{currentTicket.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Text variant="label">Reporter</Text>
                        <div className="flex items-center space-x-2">
                          <Avatar name={currentTicket.reporter?.name} showIcon={false} className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600" />
                          <p className="text-gray-900 dark:text-white">{currentTicket.reporter?.name}</p>
                        </div>
                      </div>
                      
                      {currentTicket.assignee && (
                        <div>
                          <Text variant="label">Assignee</Text>
                          <div className="flex items-center space-x-2">
                            <Avatar name={currentTicket.assignee.name} showIcon={false} className="w-6 h-6" />
                            <p className="text-gray-900 dark:text-white">{currentTicket.assignee.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Text variant="label">Created</Text>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(currentTicket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Text variant="label">Updated</Text>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(currentTicket.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
</div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4"
            onClick={handleDeleteCancel}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <Text variant="h3" className="text-lg font-semibold">
                    Delete Ticket
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    This action cannot be undone.
                  </Text>
                </div>
              </div>
              
              <p className="text-gray-900 dark:text-white mb-6">
                Are you sure you want to delete ticket <strong>#{currentTicket.id}</strong>? 
                This will permanently remove the ticket and all associated data.
              </p>
              
              <div className="flex space-x-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  Delete Ticket
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}