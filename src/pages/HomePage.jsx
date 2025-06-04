import { useState, useEffect } from 'react'
import { ticketService } from '../services'
import { HomePageTemplate } from '../components/templates/HomePageTemplate'
import { ErrorDisplay } from '../components/organisms/ErrorDisplay'

export default function HomePage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentView, setCurrentView] = useState('list')
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assignee: '',
    search: ''
  })

  useEffect(() => {
    // Apply dark mode class on initial render
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }))
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

  const handleTicketStatusUpdate = async (ticketId, newStatus) => {
    try {
      const updatedTicket = await ticketService.update(ticketId, { status: newStatus })
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return <ErrorDisplay message={error} />
  }

return (
    <HomePageTemplate
      tickets={filteredTickets}
      loading={loading}
      error={error}
      filters={filters}
      darkMode={darkMode}
      showCreateModal={showCreateModal}
      selectedTicket={selectedTicket}
      currentView={currentView}
      onFilterChange={handleFilterChange}
      onNewTicketClick={() => setShowCreateModal(true)}
      onTicketCreated={(newTicket) => {
        setTickets(prev => [newTicket, ...prev])
        setShowCreateModal(false)
      }}
      onCloseCreateModal={() => setShowCreateModal(false)}
      onTicketSelect={setSelectedTicket}
      onCloseTicketDetail={() => setSelectedTicket(null)}
      onToggleDarkMode={toggleDarkMode}
      onViewChange={setCurrentView}
      onTicketStatusUpdate={handleTicketStatusUpdate}
      getPriorityColor={getPriorityColor}
      getStatusColor={getStatusColor}
    />
  )
}