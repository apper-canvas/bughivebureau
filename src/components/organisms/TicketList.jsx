import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import { Text } from '../atoms/Text'
import { Spinner } from '../atoms/Spinner'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'

export const TicketList = ({ tickets, loading, getPriorityColor, getStatusColor, onTicketSelect }) => {
  return (
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text variant="h2" className="text-gray-900 dark:text-white font-bold">
          Tickets ({tickets.length})
        </Text>
      </div>
      
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 shadow-inner ticket-loading">
            <Spinner />
            <Text variant="p" className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Loading tickets...</Text>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Search" className="w-10 h-10 text-gray-400" />
          </div>
          <Text variant="h3" className="text-gray-700 dark:text-gray-300 mb-2">No tickets found</Text>
          <Text variant="p" className="text-gray-500 dark:text-gray-400">Try adjusting your filters or create a new ticket</Text>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <AnimatePresence>
            {tickets.map((ticket) => (
<motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="ticket-list-item p-8 group cursor-pointer"
                onClick={() => onTicketSelect(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Text variant="mono" className="text-sm font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                        #{ticket.id}
                      </Text>
                      <Badge colorClass={`enhanced-badge ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge colorClass={`enhanced-badge ${getStatusColor(ticket.status)}`}>
                        {ticket.status?.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Text variant="h3" className="text-gray-900 dark:text-white font-semibold">
                        {ticket.title}
                      </Text>
                      <Text variant="p" className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </Text>
                    </div>
                  </div>
                  
                  {ticket.assignee && (
                    <div className="flex items-center space-x-3 ml-8">
                      <Avatar name={ticket.assignee.name} showIcon={false} showName={true} className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}