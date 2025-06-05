class TicketService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'ticket';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 'status', 'assignee', 'reporter', 'created_at', 'updated_at', 'steps_to_reproduce', 'expected_behavior', 'actual_behavior'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.tableFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database fields to expected format
      return response.data.map(ticket => ({
        id: ticket.Id,
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || 'medium',
        status: ticket.status || 'new',
        assignee: ticket.assignee ? { id: ticket.assignee, name: ticket.assignee } : null,
        reporter: ticket.reporter ? { id: ticket.reporter, name: ticket.reporter } : null,
        createdAt: ticket.created_at || ticket.CreatedOn,
        updatedAt: ticket.updated_at || ticket.ModifiedOn,
        stepsToReproduce: ticket.steps_to_reproduce || '',
        expectedBehavior: ticket.expected_behavior || '',
        actualBehavior: ticket.actual_behavior || '',
        attachments: []
      }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error('Failed to fetch tickets');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.tableFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Ticket not found');
      }
      
      // Map database fields to expected format
      const ticket = response.data;
      return {
        id: ticket.Id,
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || 'medium',
        status: ticket.status || 'new',
        assignee: ticket.assignee ? { id: ticket.assignee, name: ticket.assignee } : null,
        reporter: ticket.reporter ? { id: ticket.reporter, name: ticket.reporter } : null,
        createdAt: ticket.created_at || ticket.CreatedOn,
        updatedAt: ticket.updated_at || ticket.ModifiedOn,
        stepsToReproduce: ticket.steps_to_reproduce || '',
        expectedBehavior: ticket.expected_behavior || '',
        actualBehavior: ticket.actual_behavior || '',
        attachments: []
      };
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      throw new Error('Ticket not found');
    }
  }

  async create(ticketData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: ticketData.title || '',
          title: ticketData.title || '',
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'new',
          assignee: ticketData.assignee?.id || '',
          reporter: ticketData.reporter?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          steps_to_reproduce: ticketData.stepsToReproduce || '',
          expected_behavior: ticketData.expectedBehavior || '',
          actual_behavior: ticketData.actualBehavior || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const createdTicket = response.results[0].data;
        return {
          id: createdTicket.Id,
          title: createdTicket.title || '',
          description: createdTicket.description || '',
          priority: createdTicket.priority || 'medium',
          status: createdTicket.status || 'new',
          assignee: ticketData.assignee,
          reporter: ticketData.reporter,
          createdAt: createdTicket.created_at,
          updatedAt: createdTicket.updated_at,
          stepsToReproduce: createdTicket.steps_to_reproduce || '',
          expectedBehavior: createdTicket.expected_behavior || '',
          actualBehavior: createdTicket.actual_behavior || '',
          attachments: []
        };
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw new Error('Failed to create ticket');
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields plus ID
      const params = {
        records: [{
          Id: id,
          ...(updateData.title && { title: updateData.title, Name: updateData.title }),
          ...(updateData.description && { description: updateData.description }),
          ...(updateData.priority && { priority: updateData.priority }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.assignee && { assignee: updateData.assignee.id }),
          ...(updateData.reporter && { reporter: updateData.reporter.id }),
          updated_at: new Date().toISOString(),
          ...(updateData.stepsToReproduce && { steps_to_reproduce: updateData.stepsToReproduce }),
          ...(updateData.expectedBehavior && { expected_behavior: updateData.expectedBehavior }),
          ...(updateData.actualBehavior && { actual_behavior: updateData.actualBehavior })
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const updatedTicket = response.results[0].data;
        return {
          id: updatedTicket.Id,
          title: updatedTicket.title || '',
          description: updatedTicket.description || '',
          priority: updatedTicket.priority || 'medium',
          status: updatedTicket.status || 'new',
          assignee: updateData.assignee,
          reporter: updateData.reporter,
          createdAt: updatedTicket.created_at,
          updatedAt: updatedTicket.updated_at,
          stepsToReproduce: updatedTicket.steps_to_reproduce || '',
          expectedBehavior: updatedTicket.expected_behavior || '',
          actualBehavior: updatedTicket.actual_behavior || '',
          attachments: []
        };
      } else {
        throw new Error('Failed to update ticket');
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw new Error('Failed to update ticket');
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success) {
        return true;
      } else {
        throw new Error('Failed to delete ticket');
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw new Error('Failed to delete ticket');
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status })
  }

  async assignTicket(id, assigneeId) {
    const assignee = { id: assigneeId, name: 'Assigned User' }
    return this.update(id, { assignee })
  }
}

export default new TicketService()