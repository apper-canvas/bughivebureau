import React from 'react'
import { AppHeader } from '../organisms/AppHeader'
import { FilterSection } from '../organisms/FilterSection'
import { TicketList } from '../organisms/TicketList'
import { CreateTicketForm } from '../organisms/CreateTicketForm'
import { TicketDetailModal } from '../organisms/TicketDetailModal'

export const HomePageTemplate = ({
  tickets,
  loading,
  error,
  filters,
  darkMode,
  showCreateModal,
  selectedTicket,
  onFilterChange,
  onNewTicketClick,
  onTicketCreated,
  onCloseCreateModal,
  onTicketSelect,
  onCloseTicketDetail,
  onToggleDarkMode,
  getPriorityColor,
  getStatusColor,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AppHeader
        appName="BugHive"
        searchFilter={filters.search}
        onSearchChange={(value) => onFilterChange('search', value)}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterSection
          filters={filters}
          onFilterChange={onFilterChange}
          onNewTicketClick={onNewTicketClick}
        />

        <TicketList
          tickets={tickets}
          loading={loading}
          getPriorityColor={getPriorityColor}
          getStatusColor={getStatusColor}
          onTicketSelect={onTicketSelect}
        />
      </div>

      <CreateTicketForm
        isOpen={showCreateModal}
        onClose={onCloseCreateModal}
        onTicketCreated={onTicketCreated}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={onCloseTicketDetail}
        getPriorityColor={getPriorityColor}
        getStatusColor={getStatusColor}
      />
    </div>
  )
}