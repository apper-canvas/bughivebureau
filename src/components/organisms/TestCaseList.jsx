import React from 'react';
import { Text } from '../atoms/Text';
import { Badge } from '../molecules/Badge';
import { Spinner } from '../atoms/Spinner';
import { Button } from '../atoms/Button';
import ApperIcon from '../ApperIcon';

export const TestCaseList = ({ testCases, loading, error, onTestCaseSelect, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
        <Text className="ml-3 text-gray-600 dark:text-gray-400">Loading test cases...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <Text variant="h3" className="text-gray-900 dark:text-white mb-2">Error Loading Test Cases</Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-4">{error}</Text>
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!testCases?.length) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="FileText" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <Text variant="h3" className="text-gray-900 dark:text-white mb-2">No Test Cases Found</Text>
        <Text className="text-gray-600 dark:text-gray-400">
          Create your first test case to get started with test management.
        </Text>
      </div>
    );
  }

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pass': return 'CheckCircle';
      case 'Fail': return 'XCircle';
      case 'Pending': return 'Clock';
      case 'Blocked': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testCases.map((testCase) => (
          <div
            key={testCase.id}
            onClick={() => onTestCaseSelect(testCase)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Text variant="h4" className="text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {testCase.title}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {testCase.description}
                </Text>
              </div>
              <ApperIcon 
                name={getStatusIcon(testCase.status)} 
                className={`w-5 h-5 ml-2 flex-shrink-0 ${
                  testCase.status === 'Pass' ? 'text-green-500' :
                  testCase.status === 'Fail' ? 'text-red-500' :
                  testCase.status === 'Pending' ? 'text-yellow-500' :
                  'text-gray-500'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getStatusColor(testCase.status)}>
                {testCase.status}
              </Badge>
              <Badge className={getPriorityColor(testCase.priority)}>
                {testCase.priority}
              </Badge>
              {testCase.category && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {testCase.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <ApperIcon name="User" className="w-4 h-4 mr-1" />
                <span>{testCase.assignedTo}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                <span>{testCase.estimatedTime}m</span>
              </div>
            </div>

            {testCase.tags && testCase.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {testCase.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {testCase.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    +{testCase.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {testCase.lastExecuted && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Last executed: {new Date(testCase.lastExecuted).toLocaleDateString()}
                </Text>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};