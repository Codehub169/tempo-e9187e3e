import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Input from '../ui/Input';
import RichTextEditor from '../ui/RichTextEditor'; // Assuming this will be created

export default function PostForm({ initialData = {}, onSubmit, isSubmitting, error }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [postCategories, setPostCategories] = useState(initialData.categories || []); // Array of category objects { id, name }
  const [postTags, setPostTags] = useState(initialData.tags || []); // Array of tag objects { id, name }

  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Fetch available categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setAvailableCategories(data.categories || []))
      .catch(err => console.error('Failed to fetch categories', err));

    // Fetch available tags
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => setAvailableTags(data.tags || []))
      .catch(err => console.error('Failed to fetch tags', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      categoryIds: postCategories.map(cat => cat.id),
      tagIds: postTags.map(tag => tag.id),
    };
    onSubmit(postData);
  };

  const handleCategoryToggle = (category) => {
    setPostCategories(prev => 
      prev.find(cat => cat.id === category.id) 
        ? prev.filter(cat => cat.id !== category.id)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag) => {
    setPostTags(prev => 
      prev.find(t => t.id === tag.id) 
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) {
        const addedCategory = await res.json();
        setAvailableCategories(prev => [...prev, addedCategory.category]);
        handleCategoryToggle(addedCategory.category); // Select the newly added category
        setNewCategory('');
      } else {
        console.error('Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag }),
      });
      if (res.ok) {
        const addedTag = await res.json();
        setAvailableTags(prev => [...prev, addedTag.tag]);
        handleTagToggle(addedTag.tag); // Select the newly added tag
        setNewTag('');
      } else {
        console.error('Failed to add tag');
      }
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">Error: {error}</p>}
      
      <Input
        label="Title"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        required
      />

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map(cat => (
            <button 
              type="button"
              key={cat.id}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium border
                ${postCategories.find(pc => pc.id === cat.id) 
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddNewCategory} variant="secondary" size="small">
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button 
              type="button"
              key={tag.id}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium border
                ${postTags.find(pt => pt.id === tag.id) 
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
              `}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddNewTag} variant="secondary" size="small">
            Add
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="neutral" onClick={() => router.push(initialData.id ? `/posts` : '/posts')}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting} >
          {isSubmitting ? (initialData.id ? 'Saving...' : 'Creating...') : (initialData.id ? 'Save Changes' : 'Create Post')}
        </Button>
      </div>
    </form>
  );
}
