import React from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Text } from '../atoms/Text'
import { Badge } from '../molecules/Badge'
import { Avatar } from '../molecules/Avatar'
import ApperIcon from '../ApperIcon'
import { useDroppable } from '@dnd-kit/core'
import { toast } from 'react-toastify'
const DroppableWrapper = ({ children, id, status }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className="min-w-80">
      {React.cloneElement(children, { isOver })}
    </div>
  )
}

const KanbanCard = ({ ticket, getPriorityColor, getStatusColor, onTicketSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleCardClick = (e) => {
    // Only open ticket if not clicking on drag handle
    if (!e.target.closest('.drag-handle')) {
      e.stopPropagation()
      onTicketSelect(ticket)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`kanban-card cursor-pointer ${isDragging ? 'dragging' : ''}`}
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text variant="mono" className="text-xs">#{ticket.id}</Text>
          <div 
            className="drag-handle cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            {...listeners}
          >
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <Text variant="h4" className="line-clamp-2">
          {ticket.title}
        </Text>
        
        <Text variant="p" className="text-sm line-clamp-3">
          {ticket.description}
        </Text>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge colorClass={getPriorityColor(ticket.priority)} className="text-xs">
              {ticket.priority}
            </Badge>
          </div>
          
          {ticket.assignee && (
            <Avatar 
              name={ticket.assignee.name} 
              showIcon={false} 
              showName={false} 
              className="w-6 h-6" 
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

const KanbanColumn = ({ 
  status, 
  title, 
  tickets, 
  isOver, 
  getPriorityColor, 
  getStatusColor, 
  onTicketSelect 
}) => {
  const getColumnColor = (status) => {
    switch (status) {
      case 'new': return 'border-t-4 border-gray-400'
      case 'in-progress': return 'border-t-4 border-blue-400'
      case 'testing': return 'border-t-4 border-purple-400'
      case 'resolved': return 'border-t-4 border-green-400'
      case 'closed': return 'border-t-4 border-gray-600'
      default: return 'border-t-4 border-gray-400'
    }
  }

  return (
    <div className={`kanban-column ${getColumnColor(status)} ${isOver ? 'drop-zone-over' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <Text variant="h3" className="font-semibold">
          {title}
        </Text>
        <Badge colorClass="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
          {tickets.length}
        </Badge>
      </div>
      
      <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence>
            {tickets.map((ticket) => (
              <KanbanCard
                key={ticket.id}
                ticket={ticket}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onTicketSelect={onTicketSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
      
      {tickets.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Package" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <Text variant="p" className="text-gray-500 dark:text-gray-400 text-sm">
            No tickets
          </Text>
        </div>
      )}
    </div>
  )
}

export const KanbanBoard = ({ 
  tickets, 
  loading, 
  getPriorityColor, 
  getStatusColor, 
  onTicketSelect,
  onTicketStatusUpdate 
}) => {
  const [activeId, setActiveId] = React.useState(null)
  const [overId, setOverId] = React.useState(null)

  const statuses = [
    { key: 'new', title: 'New' },
    { key: 'in-progress', title: 'In Progress' },
    { key: 'testing', title: 'Testing' },
    { key: 'resolved', title: 'Resolved' },
    { key: 'closed', title: 'Closed' }
  ]

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status)
  }

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragOver = (event) => {
    const { over } = event
    setOverId(over?.id || null)
  }

const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      setOverId(null)
      return
    }

    const activeTicket = tickets.find(t => t.id === active.id)
    
    // Check if dropped on a column
    const overId = over.id.toString()
    if (overId.startsWith('column-')) {
      const overColumnId = overId.replace('column-', '')
      const overColumn = statuses.find(s => s.key === overColumnId)
      
      if (activeTicket && overColumn && activeTicket.status !== overColumn.key) {
        onTicketStatusUpdate(activeTicket.id, overColumn.key)
        toast.success(`Ticket moved to ${overColumn.title}`)
      }
    }

    setActiveId(null)
    setOverId(null)
  }

  const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
            <Text variant="p" className="text-gray-600 dark:text-gray-400">Loading kanban board...</Text>
          </div>
        </div>
      </div>
    )
  }

  return (
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text variant="h2" className="text-gray-900 dark:text-white font-bold">
          Kanban Board ({tickets.length} tickets)
        </Text>
      </div>
      
      <div className="p-8">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
            {statuses.map((status) => (
              <DroppableWrapper
                key={status.key}
                id={`column-${status.key}`}
                status={status.key}
              >
                <KanbanColumn
                  status={status.key}
                  title={status.title}
                  tickets={getTicketsByStatus(status.key)}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  onTicketSelect={onTicketSelect}
                />
              </DroppableWrapper>
            ))}
          </div>
          
          <DragOverlay>
            {activeTicket ? (
              <div className="drag-overlay">
                <KanbanCard
                  ticket={activeTicket}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  onTicketSelect={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}