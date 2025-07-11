import Image from "next/image";
import { Upload } from "lucide-react";

export default function ProductImageUploader({
  previewImages,
  handleImageChange,
  submitting
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
          {previewImages
            ? <Image
                src={previewImages}
                alt="Product Preview"
                width={128}
                height={128}
                className="object-cover rounded-md"
              />
            : <div className="text-center text-gray-400">
                <Upload className="mx-auto h-8 w-8" />
                <span className="mt-2 block text-sm">Upload Image</span>
              </div>}
        </div>
        <label
          htmlFor="image-upload"
          className={`cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${submitting
            ? "opacity-50 cursor-not-allowed"
            : ""}`}>
          <span>
            {previewImages ? "Change" : "Upload"}
          </span>
          <input
            id="image-upload"
            name="image"
            type="file"
            className="sr-only"
            onChange={handleImageChange}
            disabled={submitting}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
}
