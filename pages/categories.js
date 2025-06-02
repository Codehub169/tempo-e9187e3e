import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  const router = useRouter();

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
      setNewCategoryName('');
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete category');
        }
        fetchCategories(); // Refresh list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }
      setEditingCategory(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-poppins text-gray-800">Manage Categories</h1>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">Error: {error}</p>}

        <form onSubmit={handleAddCategory} className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold font-poppins text-gray-700 mb-4">Add New Category</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category Name"
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
            >
              Add Category
            </button>
          </div>
        </form>

        {editingCategory && (
          <form onSubmit={handleUpdateCategory} className="mb-8 p-6 bg-white shadow-md rounded-lg border border-primary">
            <h2 className="text-xl font-semibold font-poppins text-gray-700 mb-4">Edit Category</h2>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="Category Name"
                className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
              >
                Update
              </button>
              <button 
                type="button"
                onClick={() => setEditingCategory(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : categories.length === 0 && !error ? (
          <div className="text-center py-10 px-6 bg-white shadow-md rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 font-poppins">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-lightGray transition-colors">
                  <span className="text-gray-700 font-medium">{category.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-sm bg-error hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
