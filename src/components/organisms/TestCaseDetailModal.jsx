import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Badge } from '../molecules/Badge';
import { FormField } from '../molecules/FormField';
import { Dropdown } from '../molecules/Dropdown';
import ApperIcon from '../ApperIcon';

export const TestCaseDetailModal = ({ 
  testCase, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete, 
  onExecute 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExecuteForm, setShowExecuteForm] = useState(false);
  const [editData, setEditData] = useState({
    title: testCase?.title || '',
    description: testCase?.description || '',
    category: testCase?.category || '',
    priority: testCase?.priority || 'Medium',
    testType: testCase?.testType || 'Functional',
    preconditions: testCase?.preconditions || '',
    testSteps: testCase?.testSteps || [],
    expectedResult: testCase?.expectedResult || '',
    assignedTo: testCase?.assignedTo || '',
    estimatedTime: testCase?.estimatedTime || 5,
    tags: testCase?.tags || []
  });
  const [executeData, setExecuteData] = useState({
    result: 'Pass',
    notes: ''
  });

  if (!isOpen || !testCase) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await onUpdate(testCase.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update test case:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: testCase.title || '',
      description: testCase.description || '',
      category: testCase.category || '',
      priority: testCase.priority || 'Medium',
      testType: testCase.testType || 'Functional',
      preconditions: testCase.preconditions || '',
      testSteps: testCase.testSteps || [],
      expectedResult: testCase.expectedResult || '',
      assignedTo: testCase.assignedTo || '',
      estimatedTime: testCase.estimatedTime || 5,
      tags: testCase.tags || []
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(testCase.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete test case:', error);
    }
  };

  const handleExecute = async () => {
    try {
      await onExecute(testCase.id, executeData.result, executeData.notes);
      setShowExecuteForm(false);
      setExecuteData({ result: 'Pass', notes: '' });
    } catch (error) {
      console.error('Failed to execute test case:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'Fail': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Blocked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Text variant="h2" className="text-gray-900 dark:text-white">
              Test Case Details
            </Text>
            <Badge className={getStatusColor(testCase.status)}>
              {testCase.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <Button
                  onClick={() => setShowExecuteForm(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Play" className="w-4 h-4" />
                  Execute
                </Button>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              className="p-2"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isEditing ? (
            <div className="space-y-6">
              <FormField
                label="Title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <FormField
                label="Description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                type="textarea"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dropdown
                  label="Priority"
                  value={editData.priority}
                  onChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}
                  options={[
                    { value: 'Critical', label: 'Critical' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' }
                  ]}
                />
                
                <FormField
                  label="Category"
                  value={editData.category}
                  onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                />
                
                <FormField
                  label="Test Type"
                  value={editData.testType}
                  onChange={(e) => setEditData(prev => ({ ...prev, testType: e.target.value }))}
                />
              </div>

              <FormField
                label="Preconditions"
                value={editData.preconditions}
                onChange={(e) => setEditData(prev => ({ ...prev, preconditions: e.target.value }))}
                type="textarea"
                rows={2}
              />

              <FormField
                label="Expected Result"
                value={editData.expectedResult}
                onChange={(e) => setEditData(prev => ({ ...prev, expectedResult: e.target.value }))}
                type="textarea"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Assigned To"
                  value={editData.assignedTo}
                  onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                />
                
                <FormField
                  label="Estimated Time (minutes)"
                  value={editData.estimatedTime}
                  onChange={(e) => setEditData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                  type="number"
                  min="1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button onClick={handleCancelEdit} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary-dark text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <Text variant="h3" className="text-gray-900 dark:text-white mb-3">
                  {testCase.title}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 mb-4">
                  {testCase.description}
                </Text>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getPriorityColor(testCase.priority)}>
                    {testCase.priority} Priority
                  </Badge>
                  {testCase.category && (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {testCase.category}
                    </Badge>
                  )}
                  {testCase.testType && (
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                      {testCase.testType}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Test Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Test Information
                  </Text>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Assigned to:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{testCase.assignedTo}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Estimated time:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{testCase.estimatedTime} minutes</span>
                    </div>
                    {testCase.lastExecuted && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Last executed:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {new Date(testCase.lastExecuted).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Tags
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {testCase.tags?.length > 0 ? (
                      testCase.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">No tags</Text>
                    )}
                  </div>
                </div>
              </div>

              {/* Preconditions */}
              {testCase.preconditions && (
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Preconditions
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {testCase.preconditions}
                  </Text>
                </div>
              )}

              {/* Test Steps */}
              {testCase.testSteps?.length > 0 && (
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Test Steps
                  </Text>
                  <ol className="list-decimal list-inside space-y-2">
                    {testCase.testSteps.map((step, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Expected Result */}
              {testCase.expectedResult && (
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Expected Result
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {testCase.expectedResult}
                  </Text>
                </div>
              )}

              {/* Actual Result */}
              {testCase.actualResult && (
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Actual Result
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {testCase.actualResult}
                  </Text>
                </div>
              )}

              {/* Execution History */}
              {testCase.executionHistory?.length > 0 && (
                <div>
                  <Text variant="h4" className="text-gray-900 dark:text-white mb-2">
                    Execution History
                  </Text>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {testCase.executionHistory.slice(0, 5).map((execution) => (
                      <div key={execution.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <Badge className={getStatusColor(execution.result)}>
                            {execution.result}
                          </Badge>
                          <Text className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(execution.executedAt).toLocaleDateString()} by {execution.executedBy}
                          </Text>
                        </div>
                        {execution.notes && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {execution.notes}
                          </Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Execute Form Modal */}
        {showExecuteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <Text variant="h3" className="text-gray-900 dark:text-white mb-4">
                  Execute Test Case
                </Text>
                
                <div className="space-y-4">
                  <Dropdown
                    label="Result"
                    value={executeData.result}
                    onChange={(value) => setExecuteData(prev => ({ ...prev, result: value }))}
                    options={[
                      { value: 'Pass', label: 'Pass' },
                      { value: 'Fail', label: 'Fail' },
                      { value: 'Blocked', label: 'Blocked' }
                    ]}
                  />
                  
                  <FormField
                    label="Notes (optional)"
                    value={executeData.notes}
                    onChange={(e) => setExecuteData(prev => ({ ...prev, notes: e.target.value }))}
                    type="textarea"
                    rows={3}
                    placeholder="Add any notes about the test execution..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    onClick={() => setShowExecuteForm(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleExecute}
                    className="bg-primary hover:bg-primary-dark text-white"
                  >
                    Execute Test
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-500 mr-3" />
                  <Text variant="h3" className="text-gray-900 dark:text-white">
                    Delete Test Case
                  </Text>
                </div>
                
                <Text className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this test case? This action cannot be undone.
                </Text>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    onClick={() => setShowDeleteConfirm(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};