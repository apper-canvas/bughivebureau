import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { FormField } from '../molecules/FormField';
import { Dropdown } from '../molecules/Dropdown';
import ApperIcon from '../ApperIcon';

export const CreateTestCaseForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    testType: 'Functional',
    preconditions: '',
    testSteps: [''],
    expectedResult: '',
    assignedTo: '',
    estimatedTime: 5,
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.expectedResult.trim()) {
      newErrors.expectedResult = 'Expected result is required';
    }
    
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned to is required';
    }
    
    if (formData.estimatedTime < 1) {
      newErrors.estimatedTime = 'Estimated time must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const testCaseData = {
        ...formData,
        testSteps: formData.testSteps.filter(step => step.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        status: 'Pending'
      };
      
      await onSubmit(testCaseData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        testType: 'Functional',
        preconditions: '',
        testSteps: [''],
        expectedResult: '',
        assignedTo: '',
        estimatedTime: 5,
        tags: []
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to create test case:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestStepChange = (index, value) => {
    const newSteps = [...formData.testSteps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, testSteps: newSteps }));
  };

  const addTestStep = () => {
    setFormData(prev => ({
      ...prev,
      testSteps: [...prev.testSteps, '']
    }));
  };

  const removeTestStep = (index) => {
    if (formData.testSteps.length > 1) {
      const newSteps = formData.testSteps.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, testSteps: newSteps }));
    }
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Text variant="h2" className="text-gray-900 dark:text-white">
            Create New Test Case
          </Text>
          <Button
            onClick={onClose}
            variant="ghost"
            className="p-2"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <Text variant="h3" className="text-gray-900 dark:text-white mb-4">
                Basic Information
              </Text>
              
              <div className="space-y-4">
                <FormField
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={errors.title}
                  required
                  placeholder="Enter test case title"
                />
                
                <FormField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={errors.description}
                  type="textarea"
                  rows={3}
                  required
                  placeholder="Describe what this test case verifies"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dropdown
                    label="Priority"
                    value={formData.priority}
                    onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    options={[
                      { value: 'Critical', label: 'Critical' },
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' }
                    ]}
                    required
                  />
                  
                  <FormField
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Authentication, UI/UX"
                  />
                  
                  <Dropdown
                    label="Test Type"
                    value={formData.testType}
                    onChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}
                    options={[
                      { value: 'Functional', label: 'Functional' },
                      { value: 'UI Testing', label: 'UI Testing' },
                      { value: 'Performance Testing', label: 'Performance' },
                      { value: 'Security Testing', label: 'Security' },
                      { value: 'Integration Testing', label: 'Integration' },
                      { value: 'System Testing', label: 'System' }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div>
              <Text variant="h3" className="text-gray-900 dark:text-white mb-4">
                Test Details
              </Text>
              
              <div className="space-y-4">
                <FormField
                  label="Preconditions"
                  value={formData.preconditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, preconditions: e.target.value }))}
                  type="textarea"
                  rows={2}
                  placeholder="What needs to be set up before running this test?"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Steps
                  </label>
                  <div className="space-y-2">
                    {formData.testSteps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <FormField
                            value={step}
                            onChange={(e) => handleTestStepChange(index, e.target.value)}
                            placeholder={`Step ${index + 1}`}
                          />
                        </div>
                        {formData.testSteps.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTestStep(index)}
                            variant="ghost"
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addTestStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      Add Step
                    </Button>
                  </div>
                </div>

                <FormField
                  label="Expected Result"
                  value={formData.expectedResult}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
                  error={errors.expectedResult}
                  type="textarea"
                  rows={3}
                  required
                  placeholder="What should happen when the test is executed correctly?"
                />
              </div>
            </div>

            {/* Assignment and Metadata */}
            <div>
              <Text variant="h3" className="text-gray-900 dark:text-white mb-4">
                Assignment & Metadata
              </Text>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  error={errors.assignedTo}
                  required
                  placeholder="Who will execute this test?"
                />
                
                <FormField
                  label="Estimated Time (minutes)"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                  error={errors.estimatedTime}
                  type="number"
                  min="1"
                  required
                />
              </div>

              <FormField
                label="Tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., login, security, api)"
                helpText="Tags help categorize and search for test cases"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Button 
            onClick={onClose} 
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dark text-white"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Create Test Case
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};