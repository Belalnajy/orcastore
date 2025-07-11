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
  removeArrayItem
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

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                required
              />
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
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
          label="Available Sizes"
          field="sizes"
          items={formData.sizes}
          handleArrayField={handleArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          placeholder="e.g. S, M, L"
          buttonText="Add Size"
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
    </form>
  );
}
