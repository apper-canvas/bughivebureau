import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { testCaseService } from '../services';
import { AppHeader } from '../components/organisms/AppHeader';
import { TestCaseList } from '../components/organisms/TestCaseList';
import { TestCaseDetailModal } from '../components/organisms/TestCaseDetailModal';
import { CreateTestCaseForm } from '../components/organisms/CreateTestCaseForm';
import { Button } from '../components/atoms/Button';
import { SearchInput } from '../components/molecules/SearchInput';
import { Dropdown } from '../components/molecules/Dropdown';
import ApperIcon from '../components/ApperIcon';

const TestCasesPage = () => {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load test cases on component mount
  useEffect(() => {
    loadTestCases();
  }, []);

  const loadTestCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testCaseService.getAll();
      setTestCases(data || []);
    } catch (err) {
      setError('Failed to load test cases');
      toast.error('Failed to load test cases');
      setTestCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCaseCreate = async (testCaseData) => {
    try {
      const newTestCase = await testCaseService.create(testCaseData);
      setTestCases(prev => [...prev, newTestCase]);
      setIsCreateModalOpen(false);
      toast.success('Test case created successfully!');
    } catch (err) {
      toast.error('Failed to create test case');
    }
  };

  const handleTestCaseUpdate = async (id, testCaseData) => {
    try {
      const updatedTestCase = await testCaseService.update(id, testCaseData);
      setTestCases(prev => prev.map(tc => tc.id === id ? updatedTestCase : tc));
      setSelectedTestCase(updatedTestCase);
      toast.success('Test case updated successfully!');
    } catch (err) {
      toast.error('Failed to update test case');
    }
  };

  const handleTestCaseDelete = async (id) => {
    try {
      await testCaseService.delete(id);
      setTestCases(prev => prev.filter(tc => tc.id !== id));
      setIsDetailModalOpen(false);
      setSelectedTestCase(null);
      toast.success('Test case deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete test case');
    }
  };

  const handleTestCaseExecute = async (id, result, notes) => {
    try {
      const updatedTestCase = await testCaseService.execute(id, result, notes);
      setTestCases(prev => prev.map(tc => tc.id === id ? updatedTestCase : tc));
      setSelectedTestCase(updatedTestCase);
      toast.success(`Test case marked as ${result}!`);
    } catch (err) {
      toast.error('Failed to execute test case');
    }
  };

  const handleTestCaseSelect = (testCase) => {
    setSelectedTestCase(testCase);
    setIsDetailModalOpen(true);
  };

  // Filter test cases based on search and filter criteria
  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = !searchFilter || 
      testCase.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      testCase.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      testCase.category?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      testCase.tags?.some(tag => tag.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || testCase.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || testCase.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || testCase.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(testCases.map(tc => tc.category).filter(Boolean))];
  const statuses = ['All', 'Pass', 'Fail', 'Pending', 'Blocked'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <AppHeader
        appName="Test Cases"
        searchFilter={searchFilter}
        onSearchChange={setSearchFilter}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Test Cases Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and execute your test cases efficiently
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            Create Test Case
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex-1 min-w-64">
            <SearchInput
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search test cases..."
              className="w-full"
            />
          </div>
          
          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statuses.map(status => ({ value: status, label: status }))}
            placeholder="Status"
            className="min-w-32"
          />
          
          <Dropdown
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorities.map(priority => ({ value: priority, label: priority }))}
            placeholder="Priority"
            className="min-w-32"
          />
          
          <Dropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories.map(category => ({ value: category, label: category }))}
            placeholder="Category"
            className="min-w-40"
          />
        </div>

        {/* Test Cases Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {testCases.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Test Cases</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {testCases.filter(tc => tc.status === 'Pass').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Passed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {testCases.filter(tc => tc.status === 'Fail').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Failed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {testCases.filter(tc => tc.status === 'Pending').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Pending</div>
          </div>
        </div>

        {/* Test Cases List */}
        <TestCaseList
          testCases={filteredTestCases}
          loading={loading}
          error={error}
          onTestCaseSelect={handleTestCaseSelect}
          onRetry={loadTestCases}
        />

        {/* Test Case Detail Modal */}
        {isDetailModalOpen && selectedTestCase && (
          <TestCaseDetailModal
            testCase={selectedTestCase}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedTestCase(null);
            }}
            onUpdate={handleTestCaseUpdate}
            onDelete={handleTestCaseDelete}
            onExecute={handleTestCaseExecute}
          />
        )}

        {/* Create Test Case Modal */}
        {isCreateModalOpen && (
          <CreateTestCaseForm
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleTestCaseCreate}
          />
        )}
      </div>
    </div>
  );
};

export default TestCasesPage;