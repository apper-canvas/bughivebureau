import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { ticketService } from '../services'

export default function Home() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assignee: '',
    search: ''
  })

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true)
      try {
        const result = await ticketService.getAll()
        setTickets(result || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesPriority = !filters.priority || ticket.priority === filters.priority
    const matchesStatus = !filters.status || ticket.status === filters.status
    const matchesAssignee = !filters.assignee || ticket.assignee?.name?.toLowerCase().includes(filters.assignee.toLowerCase())
    const matchesSearch = !filters.search || 
      ticket.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesPriority && matchesStatus && matchesAssignee && matchesSearch
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'testing': return 'bg-purple-100 text-purple-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Tickets</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <ApperIcon name="Bug" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">BugHive</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignee</label>
              <input
                type="text"
                placeholder="Filter by assignee..."
                value={filters.assignee}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-all-smooth hover:shadow-card"
              >
                <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
                New Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tickets ({filteredTickets.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading tickets...</span>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No tickets found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all-smooth"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">#{ticket.id}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status?.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {ticket.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 ml-4">
                        {ticket.assignee && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {ticket.assignee.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                              {ticket.assignee.name}
                            </span>
                          </div>
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
      </div>

      {/* Main Feature Modal */}
      <MainFeature 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTicketCreated={(newTicket) => {
          setTickets(prev => [newTicket, ...prev])
          setShowCreateModal(false)
        }}
      />

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
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
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">#{selectedTicket.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status?.replace('-', ' ')}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedTicket.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-900 dark:text-white">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reporter</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {selectedTicket.reporter?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-white">{selectedTicket.reporter?.name}</span>
                      </div>
                    </div>
                    
                    {selectedTicket.assignee && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignee</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {selectedTicket.assignee.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <span className="text-gray-900 dark:text-white">{selectedTicket.assignee.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created</h3>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Updated</h3>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedTicket.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}