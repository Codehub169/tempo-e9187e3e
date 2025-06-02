import Link from 'next/link';
import Button from '../ui/Button';

export default function PostListItem({ post, onDelete }) {
  const { id, title, content, createdAt, categories, tags } = post;

  // Simple excerpt function
  const createExcerpt = (htmlString, maxLength = 150) => {
    if (!htmlString) return '';
    const text = htmlString.replace(/<[^>]+>/g, ''); // Strip HTML tags
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <h2 className="text-2xl font-semibold text-gray-800 font-poppins mb-2">
        <Link href={`/posts/${id}/edit`} className="hover:text-blue-600 transition-colors">
          {title}
        </Link>
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        {new Date(createdAt).toLocaleDateString()} 
      </p>
      <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
        {createExcerpt(content)}
      </div>
      
      { (categories && categories.length > 0) && (
        <div className="mb-3">
          <span className="font-medium text-sm text-gray-600">Categories: </span>
          {categories.map((category, index) => (
            <span key={category.id} className="text-sm text-blue-500 bg-blue-100 px-2 py-1 rounded-full mr-1 mb-1 inline-block">
              {category.name}
            </span>
          ))}
        </div>
      )}

      { (tags && tags.length > 0) && (
        <div className="mb-4">
          <span className="font-medium text-sm text-gray-600">Tags: </span>
          {tags.map((tag, index) => (
            <span key={tag.id} className="text-sm text-pink-500 bg-pink-100 px-2 py-1 rounded-full mr-1 mb-1 inline-block">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end space-x-3">
        <Link href={`/posts/${id}/edit`} passHref>
          <Button variant="secondary" size="small">Edit</Button>
        </Link>
        <Button variant="danger" size="small" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
