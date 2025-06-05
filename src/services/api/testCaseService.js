import testCasesData from '../mockData/testCases.json';

// Utility function to create delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulating database)
let testCases = [...testCasesData];

const testCaseService = {
  // Get all test cases
  async getAll() {
    await delay(300);
    return [...testCases];
  },

  // Get test case by ID
  async getById(id) {
    await delay(250);
    const testCase = testCases.find(tc => tc.id === id);
    if (!testCase) {
      throw new Error('Test case not found');
    }
    return { ...testCase };
  },

  // Create new test case
  async create(testCaseData) {
    await delay(400);
    const newTestCase = {
      ...testCaseData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionHistory: []
    };
    testCases = [...testCases, newTestCase];
    return { ...newTestCase };
  },

  // Update existing test case
  async update(id, testCaseData) {
    await delay(350);
    const index = testCases.findIndex(tc => tc.id === id);
    if (index === -1) {
      throw new Error('Test case not found');
    }
    const updatedTestCase = {
      ...testCases[index],
      ...testCaseData,
      id,
      updatedAt: new Date().toISOString()
    };
    testCases = [
      ...testCases.slice(0, index),
      updatedTestCase,
      ...testCases.slice(index + 1)
    ];
    return { ...updatedTestCase };
  },

  // Delete test case
  async delete(id) {
    await delay(300);
    const index = testCases.findIndex(tc => tc.id === id);
    if (index === -1) {
      throw new Error('Test case not found');
    }
    testCases = testCases.filter(tc => tc.id !== id);
    return { success: true };
  },

  // Execute test case
  async execute(id, result, notes = '') {
    await delay(400);
    const index = testCases.findIndex(tc => tc.id === id);
    if (index === -1) {
      throw new Error('Test case not found');
    }
    
    const execution = {
      id: Date.now(),
      result,
      notes,
      executedAt: new Date().toISOString(),
      executedBy: 'Current User'
    };

    const updatedTestCase = {
      ...testCases[index],
      status: result,
      lastExecuted: new Date().toISOString(),
      executionHistory: [...(testCases[index].executionHistory || []), execution],
      updatedAt: new Date().toISOString()
    };

    testCases = [
      ...testCases.slice(0, index),
      updatedTestCase,
      ...testCases.slice(index + 1)
    ];

    return { ...updatedTestCase };
  }
};

export default testCaseService;