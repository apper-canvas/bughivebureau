import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'
import { Button } from '../atoms/Button'
import { EditTicketForm } from './EditTicketForm'
export const TicketDetailModal = ({ ticket, onClose, getPriorityColor, getStatusColor, onTicketUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(ticket)

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
    </AnimatePresence>
  )
}