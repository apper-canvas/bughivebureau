import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ApperIcon name="Bug" className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to BugHive
        </Link>
      </div>
    </div>
  )
}