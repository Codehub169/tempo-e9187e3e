import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null); // { id, name }
  const router = useRouter();

  async function fetchTags() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add tag');
      }
      setNewTagName('');
      fetchTags(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        const response = await fetch(`/api/tags/${tagId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete tag');
        }
        fetchTags(); // Refresh list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag({ ...tag });
  };

  const handleUpdateTag = async (e) => {
    e.preventDefault();
    if (!editingTag || !editingTag.name.trim()) return;
    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingTag.name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tag');
      }
      setEditingTag(null);
      fetchTags(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-poppins text-gray-800">Manage Tags</h1>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">Error: {error}</p>}

        <form onSubmit={handleAddTag} className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold font-poppins text-gray-700 mb-4">Add New Tag</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag Name"
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
            >
              Add Tag
            </button>
          </div>
        </form>

        {editingTag && (
          <form onSubmit={handleUpdateTag} className="mb-8 p-6 bg-white shadow-md rounded-lg border border-primary">
            <h2 className="text-xl font-semibold font-poppins text-gray-700 mb-4">Edit Tag</h2>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={editingTag.name}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                placeholder="Tag Name"
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
                onClick={() => setEditingTag(null)}
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
        ) : tags.length === 0 && !error ? (
          <div className="text-center py-10 px-6 bg-white shadow-md rounded-lg">
             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7A2 2 0 0112 21H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 font-poppins">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new tag.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {tags.map((tag) => (
                <li key={tag.id} className="px-6 py-4 flex items-center justify-between hover:bg-lightGray transition-colors">
                  <span className="text-gray-700 font-medium">{tag.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
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
