class UserService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'User1';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'email', 'role', 'avatar'];
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
      return response.data.map(user => ({
        id: user.Id,
        name: user.Name || '',
        email: user.email || '',
        role: user.role || '',
        avatar: user.avatar || ''
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error('Failed to fetch users');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.tableFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('User not found');
      }
      
      // Map database fields to expected format
      const user = response.data;
      return {
        id: user.Id,
        name: user.Name || '',
        email: user.email || '',
        role: user.role || '',
        avatar: user.avatar || ''
      };
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error('User not found');
    }
  }

  async create(userData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: userData.name || '',
          email: userData.email || '',
          role: userData.role || '',
          avatar: userData.avatar || '',
          Tags: userData.tags || '',
          Owner: userData.owner || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const createdUser = response.results[0].data;
        return {
          id: createdUser.Id,
          name: createdUser.Name || '',
          email: createdUser.email || '',
          role: createdUser.role || '',
          avatar: createdUser.avatar || ''
        };
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error('Failed to create user');
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields plus ID
      const params = {
        records: [{
          Id: id,
          ...(updateData.name && { Name: updateData.name }),
          ...(updateData.email && { email: updateData.email }),
          ...(updateData.role && { role: updateData.role }),
          ...(updateData.avatar && { avatar: updateData.avatar }),
          ...(updateData.tags && { Tags: updateData.tags }),
          ...(updateData.owner && { Owner: updateData.owner })
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const updatedUser = response.results[0].data;
        return {
          id: updatedUser.Id,
          name: updatedUser.Name || '',
          email: updatedUser.email || '',
          role: updatedUser.role || '',
          avatar: updatedUser.avatar || ''
        };
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error('Failed to update user');
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
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error('Failed to delete user');
    }
  }
}

export default new UserService()