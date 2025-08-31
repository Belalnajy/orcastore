import { Loader2, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function DeleteConfirmationModal({ show, onClose, onConfirm, submitting }) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose, submitting]);

  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close modal when clicking backdrop (but not when submitting)
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product and all its associated data.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={submitting}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={onConfirm}
            disabled={submitting}
            type="button"
            autoFocus
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                Deleting...
              </>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
