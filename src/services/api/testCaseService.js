// Initialize ApperSDK client for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const testCaseService = {
  // Get all test cases from database
  async getAll() {
    try {
      const client = getApperClient();
      const response = await client.getRecords('test_cases');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
      throw new Error('Failed to load test cases from database');
    }
  },

  // Get test case by ID from database
  async getById(id) {
    try {
      const client = getApperClient();
      const response = await client.getRecord('test_cases', id);
      if (!response.data) {
        throw new Error('Test case not found');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch test case:', error);
      throw new Error('Test case not found');
    }
  },

  // Create new test case in database
  async create(testCaseData) {
    try {
      const client = getApperClient();
      const newTestCase = {
        ...testCaseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionHistory: []
      };
      const response = await client.createRecord('test_cases', newTestCase);
      return response.data;
    } catch (error) {
      console.error('Failed to create test case:', error);
      throw new Error('Failed to create test case in database');
    }
  },

  // Update existing test case in database
  async update(id, testCaseData) {
    try {
      const client = getApperClient();
      const updatedData = {
        ...testCaseData,
        updatedAt: new Date().toISOString()
      };
      const response = await client.updateRecord('test_cases', id, updatedData);
      return response.data;
    } catch (error) {
      console.error('Failed to update test case:', error);
      throw new Error('Failed to update test case in database');
    }
  },

  // Delete test case from database
  async delete(id) {
    try {
      const client = getApperClient();
      await client.deleteRecord('test_cases', id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete test case:', error);
      throw new Error('Failed to delete test case from database');
    }
  },

  // Execute test case and update database
  async execute(id, result, notes = '') {
    try {
      const client = getApperClient();
      
      // First get the current test case
      const currentTestCase = await this.getById(id);
      
      const execution = {
        id: Date.now(),
        result,
        notes,
        executedAt: new Date().toISOString(),
        executedBy: 'Current User'
      };

      const updatedTestCase = {
        ...currentTestCase,
        status: result,
        lastExecuted: new Date().toISOString(),
        executionHistory: [...(currentTestCase.executionHistory || []), execution],
        updatedAt: new Date().toISOString()
      };

      const response = await client.updateRecord('test_cases', id, updatedTestCase);
      return response.data;
    } catch (error) {
      console.error('Failed to execute test case:', error);
      throw new Error('Failed to execute test case in database');
    }
  }
};

export default testCaseService;