"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  PlusCircle,
  Trash2,
  UploadCloud,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Link from "next/link";

const EditProductClient = ({ productId }) => {
  const router = useRouter();
  const [productData, setProductData] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  console.log(productData);

  const fetchProductDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard/products/${productId}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch product details.");
      }
      const data = await response.json();
      console.log(data);
      // Ensure all fields exist, providing defaults if not
      setProductData({
        name: data?.name || "",
        slug: data?.slug || "",
        description: data?.description || "",
        shortDescription: data?.shortDescription || "",
        price: data?.price || 0,
        compareAtPrice:
          data?.compareAtPrice === 0 ? null : data?.compareAtPrice, // Handle 0 as null
        category: data?.category || "",
        brand: data?.brand || "",
        tags: data?.tags || [],
        images: data?.images || [{ src: "", alt: "" }],
        videos: data?.videos || [{ src: "", title: "" }],
        stock: data?.stock || 0,
        sku: data?.sku || "",
        variants: data?.variants || [],
        isPublished: data?.isPublished || false,
        featured: data?.featured || false,
        seo: data?.seo || { title: "", description: "", keywords: [] },
        dimensions: data?.dimensions || {
          length: null,
          width: null,
          height: null,
          unit: "cm",
        },
        weight: data?.weight || { value: null, unit: "kg" },
      });
    } catch (err) {
      console.error("Fetch product error:", err);
      setFormError(err.message);
      Swal.fire(
        "Error",
        `Could not load product data: ${err.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId, fetchProductDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || null
          : value,
    }));
  };

  const handleNestedChange = (path, value, type = "text", checked = false) => {
    setProductData((prev) => {
      const keys = path.split(".");
      let current = { ...prev }; // Create a shallow copy to modify
      let objRef = current;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!objRef[keys[i]]) objRef[keys[i]] = {}; // Create nested object if it doesn't exist
        objRef = objRef[keys[i]];
      }
      objRef[keys[keys.length - 1]] =
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || null
          : value;
      return current;
    });
  };

  const handleListChange = (listName, index, field, value) => {
    setProductData((prev) => {
      const newList = [...prev[listName]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName, defaultItem) => {
    setProductData((prev) => ({
      ...prev,
      [listName]: [...(prev[listName] || []), defaultItem], // Ensure list exists
    }));
  };

  const removeListItem = (listName, index) => {
    setProductData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !productData.tags.includes(tagInput.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleSeoKeywordAdd = () => {
    if (
      seoKeywordInput.trim() &&
      !productData.seo.keywords.includes(seoKeywordInput.trim())
    ) {
      setProductData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, seoKeywordInput.trim()],
        },
      }));
      setSeoKeywordInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (
      !productData.name ||
      productData.price == null ||
      !productData.category ||
      productData.stock == null
    ) {
      Swal.fire(
        "Error",
        "Name, Price, Category, and Stock are required.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...productData,
      images: productData.images.filter(
        (img) => img.src && img.src.trim() !== ""
      ),
      videos: productData.videos.filter(
        (vid) => vid.src && vid.src.trim() !== ""
      ),
      compareAtPrice:
        productData.compareAtPrice === 0 ? null : productData.compareAtPrice,
    };

    try {
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }
      Swal.fire("Success!", "Product updated successfully.", "success");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Update error:", err);
      setFormError(err.message);
      Swal.fire("Error", `Failed to update product: ${err.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-shadow";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 size={48} className='animate-spin text-blue-500' />
        <p className='ml-3 text-lg'>Loading product details...</p>
      </div>
    );
  }

  if (formError && !productData) {
    // If initial fetch failed
    return (
      <div className='container mx-auto p-6 text-center'>
        <p className='text-red-500 text-xl mb-4'>Error: {formError}</p>
        <Link
          href='/dashboard/products'
          className='text-blue-500 hover:underline'>
          Go back to Product List
        </Link>
      </div>
    );
  }

  if (!productData) {
    // Should not happen if isLoading is false and no error, but as a fallback
    return (
      <div className='text-center p-6'>Product data could not be loaded.</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto p-4 md:p-6 bg-white shadow-xl rounded-lg'>
      <div className='flex items-center mb-6 pb-4'>
        <Link
          href='/dashboard/products'
          className='p-2 mr-2 rounded-full hover:bg-gray-100'>
          <ArrowLeft size={24} />
        </Link>
        <h2 className='text-2xl md:text-3xl font-medium text-gray-800'>
          <strong>Edit:</strong> {productData?.name}
        </h2>
      </div>

      {formError && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
          role='alert'>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            Basic Information
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label htmlFor='name' className={labelClass}>
                Product Name*
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={productData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor='slug' className={labelClass}>
                Slug
              </label>
              <input
                type='text'
                name='slug'
                id='slug'
                value={productData.slug}
                onChange={handleChange}
                className={inputClass}
                placeholder='e.g., cool-sunglasses-xyz'
              />
            </div>
            <div>
              <label htmlFor='price' className={labelClass}>
                Price*
              </label>
              <input
                type='number'
                name='price'
                id='price'
                value={productData.price}
                onChange={handleChange}
                className={inputClass}
                required
                min='0'
                step='0.01'
              />
            </div>
            <div>
              <label htmlFor='compareAtPrice' className={labelClass}>
                Compare At Price (Optional)
              </label>
              <input
                type='number'
                name='compareAtPrice'
                id='compareAtPrice'
                value={productData.compareAtPrice || ""}
                onChange={handleChange}
                className={inputClass}
                min='0'
                step='0.01'
                placeholder='Original price if discounted'
              />
            </div>
            <div>
              <label htmlFor='category' className={labelClass}>
                Category*
              </label>
              <input
                type='text'
                name='category'
                id='category'
                value={productData.category}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor='brand' className={labelClass}>
                Brand (Optional)
              </label>
              <input
                type='text'
                name='brand'
                id='brand'
                value={productData.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor='stock' className={labelClass}>
                Stock Quantity*
              </label>
              <input
                type='number'
                name='stock'
                id='stock'
                value={productData.stock}
                onChange={handleChange}
                className={inputClass}
                required
                min='0'
              />
            </div>
            <div>
              <label htmlFor='sku' className={labelClass}>
                SKU (Optional, must be unique)
              </label>
              <input
                type='text'
                name='sku'
                id='sku'
                value={productData.sku}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Descriptions */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            Descriptions
          </h2>
          <div>
            <label htmlFor='description' className={labelClass}>
              Full Description*
            </label>
            <textarea
              name='description'
              id='description'
              value={productData.description}
              onChange={handleChange}
              rows='5'
              className={inputClass}
              required
            />
          </div>
          <div className='mt-4'>
            <label htmlFor='shortDescription' className={labelClass}>
              Short Description (Optional)
            </label>
            <textarea
              name='shortDescription'
              id='shortDescription'
              value={productData.shortDescription}
              onChange={handleChange}
              rows='2'
              className={inputClass}
            />
          </div>
        </section>

        {/* Media: Images and Videos */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>Media</h2>
          {/* Images */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-gray-600 mb-2'>Images</h3>
            {productData.images.map((img, index) => (
              <div
                key={index}
                className='flex items-center gap-2 mb-2 p-2 ring ring-gray-200 rounded'>
                <input
                  type='text'
                  placeholder='Image URL'
                  value={img.src}
                  onChange={(e) =>
                    handleListChange("images", index, "src", e.target.value)
                  }
                  className={`${inputClass} flex-grow`}
                />
                <input
                  type='text'
                  placeholder='Alt Text'
                  value={img.alt}
                  onChange={(e) =>
                    handleListChange("images", index, "alt", e.target.value)
                  }
                  className={`${inputClass} flex-grow`}
                />
                {productData.images.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeListItem("images", index)}
                    className='p-2 text-red-500 hover:text-red-700'>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type='button'
              onClick={() => addListItem("images", { src: "", alt: "" })}
              className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center'>
              <PlusCircle size={16} className='mr-1' /> Add Image
            </button>
          </div>
          {/* Videos */}
          <div>
            <h3 className='text-lg font-medium text-gray-600 mb-2'>
              Videos (Optional)
            </h3>
            {productData.videos.map((vid, index) => (
              <div
                key={index}
                className='flex items-center gap-2 mb-2 p-2 ring ring-gray-200 rounded'>
                <input
                  type='text'
                  placeholder='Video URL (e.g., YouTube)'
                  value={vid.src}
                  onChange={(e) =>
                    handleListChange("videos", index, "src", e.target.value)
                  }
                  className={`${inputClass} flex-grow`}
                />
                <input
                  type='text'
                  placeholder='Video Title'
                  value={vid.title}
                  onChange={(e) =>
                    handleListChange("videos", index, "title", e.target.value)
                  }
                  className={`${inputClass} flex-grow`}
                />
                <button
                  type='button'
                  onClick={() => removeListItem("videos", index)}
                  className='p-2 text-red-500 hover:text-red-700'>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() => addListItem("videos", { src: "", title: "" })}
              className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center'>
              <PlusCircle size={16} className='mr-1' /> Add Video
            </button>
          </div>
        </section>

        {/* Tags */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>Tags</h2>
          <div className='flex items-center gap-2 mb-2'>
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder='Add a tag'
              className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <button
              type='button'
              onClick={handleTagAdd}
              className='p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {productData.tags.map((tag, index) => (
              <span
                key={index}
                className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center'>
                {tag}
                <button
                  type='button'
                  onClick={() => removeListItem("tags", index)}
                  className='ml-2 text-red-500 hover:text-red-700'>
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Variants */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            Variants (Optional)
          </h2>
          {productData.variants.map((variant, index) => (
            <div
              key={index}
              className='grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 ring ring-gray-200 rounded-md'>
              <input
                type='text'
                placeholder='Color'
                value={variant.color}
                onChange={(e) =>
                  handleListChange("variants", index, "color", e.target.value)
                }
                className={inputClass}
              />
              <input
                type='text'
                placeholder='Size'
                value={variant.size}
                onChange={(e) =>
                  handleListChange("variants", index, "size", e.target.value)
                }
                className={inputClass}
              />
              <input
                type='number'
                placeholder='Stock'
                value={variant.stock}
                onChange={(e) =>
                  handleListChange(
                    "variants",
                    index,
                    "stock",
                    parseFloat(e.target.value)
                  )
                }
                className={inputClass}
                min='0'
              />
              <input
                type='number'
                placeholder='Price Modifier (+/-)'
                value={variant.priceModifier}
                onChange={(e) =>
                  handleListChange(
                    "variants",
                    index,
                    "priceModifier",
                    parseFloat(e.target.value)
                  )
                }
                className={inputClass}
                step='0.01'
              />
              <button
                type='button'
                onClick={() => removeListItem("variants", index)}
                className='md:col-span-4 text-red-500 hover:text-red-700 text-sm flex items-center justify-end'>
                <Trash2 size={16} className='mr-1' /> Remove Variant
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={() =>
              addListItem("variants", {
                color: "",
                size: "",
                stock: 0,
                priceModifier: 0,
              })
            }
            className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center'>
            <PlusCircle size={16} className='mr-1' /> Add Variant
          </button>
        </section>

        {/* SEO */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            SEO (Optional)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label htmlFor='seoTitle' className={labelClass}>
                SEO Title
              </label>
              <input
                type='text'
                name='seo.title'
                id='seoTitle'
                value={productData.seo.title}
                onChange={(e) =>
                  handleNestedChange("seo.title", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor='seoDescription' className={labelClass}>
                SEO Meta Description
              </label>
              <textarea
                name='seo.description'
                id='seoDescription'
                value={productData.seo.description}
                onChange={(e) =>
                  handleNestedChange("seo.description", e.target.value)
                }
                rows='2'
                className={inputClass}
              />
            </div>
          </div>
          <div className='mt-4'>
            <label className={labelClass}>SEO Keywords</label>
            <div className='flex items-center gap-2 mb-2'>
              <input
                type='text'
                value={seoKeywordInput}
                onChange={(e) => setSeoKeywordInput(e.target.value)}
                placeholder='Add a keyword'
                className={inputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSeoKeywordAdd();
                  }
                }}
              />
              <button
                type='button'
                onClick={handleSeoKeywordAdd}
                className='p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {productData.seo.keywords.map((kw, index) => (
                <span
                  key={index}
                  className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center'>
                  {kw}
                  <button
                    type='button'
                    onClick={() => removeListItem("seo.keywords", index)}
                    className='ml-2 text-red-500 hover:text-red-700'>
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Publishing Status */}
        <section className='p-4 ring ring-gray-200 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>Status</h2>
          <div className='flex items-center space-x-4'>
            <label
              htmlFor='isPublished'
              className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                name='isPublished'
                id='isPublished'
                checked={productData.isPublished}
                onChange={handleChange}
                className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span>Publish Product</span>
            </label>
            <label
              htmlFor='featured'
              className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                name='featured'
                id='featured'
                checked={productData.featured}
                onChange={handleChange}
                className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span>Mark as Featured</span>
            </label>
          </div>
        </section>

        {/* Submit Button */}
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed'>
            {isSubmitting ? (
              <Loader2 size={20} className='mr-2 animate-spin' />
            ) : (
              <Save size={20} className='mr-2' />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProductClient;
