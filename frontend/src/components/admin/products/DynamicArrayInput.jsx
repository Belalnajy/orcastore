import { Plus, X } from 'lucide-react';

export default function DynamicArrayInput({ label, field, items, handleArrayField, addArrayItem, removeArrayItem, placeholder, buttonText }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {items.map((item, index) => (
        <div key={`${field}-${index}`} className="flex mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayField(field, index, e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => removeArrayItem(field, index)}
            className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="mt-2 flex items-center text-sm text-secondary hover:text-secondary/80"
      >
        <Plus className="h-4 w-4 mr-1" />
        {buttonText}
      </button>
    </div>
  );
}
