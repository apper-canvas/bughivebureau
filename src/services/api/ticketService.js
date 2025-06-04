import ticketData from '../mockData/tickets.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TicketService {
  constructor() {
    this.tickets = [...ticketData]
  }

  async getAll() {
    await delay(300)
    return [...this.tickets]
  }

  async getById(id) {
    await delay(200)
    const ticket = this.tickets.find(t => t.id === id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    return { ...ticket }
  }

  async create(ticketData) {
    await delay(400)
    const newTicket = {
      ...ticketData,
      id: `TKT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.tickets.unshift(newTicket)
    return { ...newTicket }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.tickets.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Ticket not found')
    }
    
    const updatedTicket = {
      ...this.tickets[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    this.tickets[index] = updatedTicket
    return { ...updatedTicket }
  }

  async delete(id) {
    await delay(250)
    const index = this.tickets.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Ticket not found')
    }
    
    const deletedTicket = this.tickets.splice(index, 1)[0]
    return { ...deletedTicket }
  }

  async updateStatus(id, status) {
    return this.update(id, { status })
  }

  async assignTicket(id, assigneeId) {
    // In a real app, you'd fetch the user details
    const assignee = { id: assigneeId, name: 'Assigned User' }
    return this.update(id, { assignee })
  }
}

export default new TicketService()