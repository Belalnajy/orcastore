import ProductImageUploader from "./ProductImageUploader";
import DynamicArrayInput from "./DynamicArrayInput";

export default function ProductForm({
  formData,
  handleChange,
  handleSubmit,
  categories,
  submitting,
  previewImage,
  handleImageChange,
  handleArrayField,
  addArrayItem,
  removeArrayItem,
  handleSizeStockChange
}) {
  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Main details */}
        <div className="md:col-span-2 space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-secondary focus:border-secondary"
              readOnly
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
            />
          </div>
        </div>

        {/* Right Column: Image, Category, etc. */}
        <div className="space-y-6">
          {/* Image Uploader */}
          <ProductImageUploader
            previewImage={previewImage}
            handleImageChange={handleImageChange}
            submitting={submitting}
          />

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
              required>
              <option value="">Select a category</option>
              {categories.map(cat =>
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              )}
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
              step="0.01"
              required
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-900">
              Product is active
            </label>
          </div>
        </div>
      </div>

      {/* Array Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
        <DynamicArrayInput
          label="Features"
          field="features"
          items={formData.features}
          handleArrayField={handleArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          placeholder="e.g. Lightweight, Waterproof"
          buttonText="Add Feature"
        />
        <DynamicArrayInput
          label="Available Colors"
          field="colors"
          items={formData.colors}
          handleArrayField={handleArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          placeholder="e.g. red, blue, black"
          buttonText="Add Color"
        />
      </div>
      
      {/* Sizes and Stock Management */}
      <div className="pt-8 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Sizes & Stock Management <span className="text-red-500">*</span>
        </label>
        <div className="bg-gray-50 p-4 rounded-lg">
          {/* Size Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Available Sizes
            </label>
            <DynamicArrayInput
              field="sizes"
              items={formData.sizes}
              handleArrayField={handleArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              placeholder="e.g. S, M, L, XL"
              buttonText="Add Size"
            />
          </div>
          
          {/* Stock Management Section */}
          {formData.sizes.some(size => size.trim()) && handleSizeStockChange && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Stock Quantity for Each Size
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.sizes
                  .filter(size => size.trim()) // Only show non-empty sizes
                  .map((size, index) => (
                  <div key={`stock-${size}-${index}`} className="bg-white p-3 rounded-md border">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size: <span className="font-bold text-secondary">{size}</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizeStock?.[size] || ''}
                      onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary"
                      placeholder="0"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.sizeStock?.[size] > 0 ? 
                        `${formData.sizeStock[size]} في المخزون` : 
                        'غير متوفر'
                      }
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>ملاحظة:</strong> المقاسات التي لها مخزون 0 أو فارغة لن تظهر كمتاحة للعملاء
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
