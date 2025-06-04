import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Spinner } from '../atoms/Spinner'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'

export const TicketList = ({ tickets, loading, getPriorityColor, getStatusColor, onTicketSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <Text variant="h2">
          Tickets ({tickets.length})
        </Text>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Spinner />
            <Text variant="p" className="text-gray-600 dark:text-gray-400">Loading tickets...</Text>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-8 text-center">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <Text variant="p">No tickets found matching your criteria.</Text>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all-smooth"
                onClick={() => onTicketSelect(ticket)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Text variant="mono">#{ticket.id}</Text>
                      <Badge colorClass={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge colorClass={getStatusColor(ticket.status)}>
                        {ticket.status?.replace('-', ' ')}
                      </Badge>
                    </div>
                    <Text variant="h3">
                      {ticket.title}
                    </Text>
                    <Text variant="p" className="truncate mt-1">
                      {ticket.description}
                    </Text>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    {ticket.assignee && (
                      <Avatar name={ticket.assignee.name} showIcon={false} showName={true} className="w-6 h-6" />
                    )}
                    <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}