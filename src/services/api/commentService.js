class CommentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'Comment1';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'ticket_id', 'author', 'content', 'created_at'];
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
      return response.data.map(comment => ({
        id: comment.Id,
        ticketId: comment.ticket_id || '',
        author: comment.author ? { id: comment.author, name: comment.author } : null,
        content: comment.content || '',
        createdAt: comment.created_at || comment.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error('Failed to fetch comments');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.tableFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Comment not found');
      }
      
      // Map database fields to expected format
      const comment = response.data;
      return {
        id: comment.Id,
        ticketId: comment.ticket_id || '',
        author: comment.author ? { id: comment.author, name: comment.author } : null,
        content: comment.content || '',
        createdAt: comment.created_at || comment.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      throw new Error('Comment not found');
    }
  }

  async getByTicketId(ticketId) {
    try {
      const params = {
        fields: this.tableFields,
        where: [
          {
            fieldName: "ticket_id",
            operator: "ExactMatch",
            values: [ticketId]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      // Map database fields to expected format
      return response.data.map(comment => ({
        id: comment.Id,
        ticketId: comment.ticket_id || '',
        author: comment.author ? { id: comment.author, name: comment.author } : null,
        content: comment.content || '',
        createdAt: comment.created_at || comment.CreatedOn
      }));
    } catch (error) {
      console.error(`Error fetching comments for ticket ${ticketId}:`, error);
      return [];
    }
  }

  async create(commentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: commentData.content ? commentData.content.substring(0, 50) : '',
          ticket_id: commentData.ticketId || '',
          author: commentData.author?.id || '',
          content: commentData.content || '',
          created_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const createdComment = response.results[0].data;
        return {
          id: createdComment.Id,
          ticketId: createdComment.ticket_id || '',
          author: commentData.author,
          content: createdComment.content || '',
          createdAt: createdComment.created_at
        };
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error('Failed to create comment');
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields plus ID
      const params = {
        records: [{
          Id: id,
          ...(updateData.content && { content: updateData.content, Name: updateData.content.substring(0, 50) }),
          ...(updateData.ticketId && { ticket_id: updateData.ticketId }),
          ...(updateData.author && { author: updateData.author.id })
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const updatedComment = response.results[0].data;
        return {
          id: updatedComment.Id,
          ticketId: updatedComment.ticket_id || '',
          author: updateData.author,
          content: updatedComment.content || '',
          createdAt: updatedComment.created_at
        };
      } else {
        throw new Error('Failed to update comment');
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      throw new Error('Failed to update comment');
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
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error('Failed to delete comment');
    }
  }
}

export default new CommentService()