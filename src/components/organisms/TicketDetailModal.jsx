import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'

export const TicketDetailModal = ({ ticket, onClose, getPriorityColor, getStatusColor }) => {
  if (!ticket) return null

  return (
    <AnimatePresence>
      {ticket && (
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
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Text variant="mono">#{ticket.id}</Text>
                    <Badge colorClass={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge colorClass={getStatusColor(ticket.status)}>
                      {ticket.status?.replace('-', ' ')}
                    </Badge>
                  </div>
                  <Text variant="h2" className="text-xl font-semibold">
                    {ticket.title}
                  </Text>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Text variant="label">Description</Text>
                  <p className="text-gray-900 dark:text-white">{ticket.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Text variant="label">Reporter</Text>
                    <div className="flex items-center space-x-2">
                      <Avatar name={ticket.reporter?.name} showIcon={false} className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600" />
                      <p className="text-gray-900 dark:text-white">{ticket.reporter?.name}</p>
                    </div>
                  </div>
                  
                  {ticket.assignee && (
                    <div>
                      <Text variant="label">Assignee</Text>
                      <div className="flex items-center space-x-2">
                        <Avatar name={ticket.assignee.name} showIcon={false} className="w-6 h-6" />
                        <p className="text-gray-900 dark:text-white">{ticket.assignee.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Text variant="label">Created</Text>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Text variant="label">Updated</Text>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}