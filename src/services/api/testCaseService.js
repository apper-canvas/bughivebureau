class TestCaseService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'test_case';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'category', 'status', 'priority', 'created_at', 'updated_at', 'execution_history', 'last_executed'];
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
      return response.data.map(testCase => ({
        id: testCase.Id,
        title: testCase.title || '',
        description: testCase.description || '',
        category: testCase.category || '',
        status: testCase.status || 'Pending',
        priority: testCase.priority || 'Medium',
        createdAt: testCase.created_at || testCase.CreatedOn,
        updatedAt: testCase.updated_at || testCase.ModifiedOn,
        executionHistory: testCase.execution_history ? JSON.parse(testCase.execution_history) : [],
        lastExecuted: testCase.last_executed
      }));
    } catch (error) {
      console.error("Error fetching test cases:", error);
      throw new Error('Failed to fetch test cases');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.tableFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Test case not found');
      }
      
      // Map database fields to expected format
      const testCase = response.data;
      return {
        id: testCase.Id,
        title: testCase.title || '',
        description: testCase.description || '',
        category: testCase.category || '',
        status: testCase.status || 'Pending',
        priority: testCase.priority || 'Medium',
        createdAt: testCase.created_at || testCase.CreatedOn,
        updatedAt: testCase.updated_at || testCase.ModifiedOn,
        executionHistory: testCase.execution_history ? JSON.parse(testCase.execution_history) : [],
        lastExecuted: testCase.last_executed
      };
    } catch (error) {
      console.error(`Error fetching test case with ID ${id}:`, error);
      throw new Error('Test case not found');
    }
  }

  async create(testCaseData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: testCaseData.title || '',
          title: testCaseData.title || '',
          description: testCaseData.description || '',
          category: testCaseData.category || '',
          status: testCaseData.status || 'Pending',
          priority: testCaseData.priority || 'Medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          execution_history: JSON.stringify([]),
          last_executed: null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const createdTestCase = response.results[0].data;
        return {
          id: createdTestCase.Id,
          title: createdTestCase.title || '',
          description: createdTestCase.description || '',
          category: createdTestCase.category || '',
          status: createdTestCase.status || 'Pending',
          priority: createdTestCase.priority || 'Medium',
          createdAt: createdTestCase.created_at,
          updatedAt: createdTestCase.updated_at,
          executionHistory: [],
          lastExecuted: null
        };
      } else {
        throw new Error('Failed to create test case');
      }
    } catch (error) {
      console.error("Error creating test case:", error);
      throw new Error('Failed to create test case');
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
          ...(updateData.category && { category: updateData.category }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.priority && { priority: updateData.priority }),
          updated_at: new Date().toISOString(),
          ...(updateData.executionHistory && { execution_history: JSON.stringify(updateData.executionHistory) }),
          ...(updateData.lastExecuted && { last_executed: updateData.lastExecuted })
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        const updatedTestCase = response.results[0].data;
        return {
          id: updatedTestCase.Id,
          title: updatedTestCase.title || '',
          description: updatedTestCase.description || '',
          category: updatedTestCase.category || '',
          status: updatedTestCase.status || 'Pending',
          priority: updatedTestCase.priority || 'Medium',
          createdAt: updatedTestCase.created_at,
          updatedAt: updatedTestCase.updated_at,
          executionHistory: updatedTestCase.execution_history ? JSON.parse(updatedTestCase.execution_history) : [],
          lastExecuted: updatedTestCase.last_executed
        };
      } else {
        throw new Error('Failed to update test case');
      }
    } catch (error) {
      console.error("Error updating test case:", error);
      throw new Error('Failed to update test case');
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
        throw new Error('Failed to delete test case');
      }
    } catch (error) {
      console.error("Error deleting test case:", error);
      throw new Error('Failed to delete test case');
    }
  }

  async execute(id, result, notes = '') {
    try {
      // First get the current test case
      const currentTestCase = await this.getById(id);
      
      const execution = {
        id: Date.now(),
        result,
        notes,
        executedAt: new Date().toISOString(),
        executedBy: 'Current User'
      };

      const updatedExecutionHistory = [...(currentTestCase.executionHistory || []), execution];

      const updateData = {
        status: result,
        lastExecuted: new Date().toISOString(),
        executionHistory: updatedExecutionHistory
      };

      return await this.update(id, updateData);
    } catch (error) {
      console.error('Failed to execute test case:', error);
      throw new Error('Failed to execute test case');
    }
  }
}

export default new TestCaseService();