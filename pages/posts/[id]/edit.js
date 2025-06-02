import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PostForm from '@/components/posts/PostForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
// import { useSession, getSession } from 'next-auth/react'; // Example for session handling

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Example: const { data: session, status } = useSession();
  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (status === 'unauthenticated') {
  //     router.push('/login');
  //   }
  // }, [status, router]);

  useEffect(() => {
    if (id /* && status === 'authenticated' */) { // Check session status before fetching if using next-auth
      async function fetchPost() {
        try {
          setLoading(true);
          setFetchError(null);
          const response = await fetch(`/api/posts/${id}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 404) throw new Error('Post not found. It might have been deleted or the link is incorrect.');
            throw new Error(errorData.message || `Failed to fetch post data. Status: ${response.status}`);
          }
          const data = await response.json();
          setPost(data);
        } catch (err) {
          setFetchError(err.message);
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchPost();
    }
    // if (status === 'unauthenticated' && id) { // Handle case where id is present but user logs out
    //   router.push('/login');
    // }
  }, [id, router /*, status */]); // Add status to dependency array if using session checks

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update post. Status: ${response.status}`);
      }
      router.push('/posts'); 
    } catch (err) {
      setSubmitError(err.message);
      console.error('Failed to update post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (status === 'loading' || (loading && status !== 'unauthenticated')) {
  //   return (
  //     <Layout>
  //       <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen-minus-header">
  //         <LoadingSpinner />
  //       </div>
  //     </Layout>
  //   );
  // }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen-minus-header">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (fetchError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
            <svg className="mx-auto h-12 w-12 text-error-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
            <h1 className="mt-4 text-2xl font-bold font-display text-error-700 mb-3">Error Loading Post</h1>
            <p className="text-neutral-600 mb-6">{fetchError}</p>
            <Link href="/posts" passHref>
                <Button variant="primary">Back to Posts</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post /* && status === 'authenticated' */) { // Check session status if using next-auth
    // This case should ideally be covered by fetchError if API returns 404 and sets the message correctly.
    // Or if user is unauthenticated and redirected.
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Post data is not available. It might be loading or an error occurred.</p>
           <Link href="/posts" passHref>
                <Button variant="secondary" className="mt-4">Go to Posts</Button>
            </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-800 mb-6 sm:mb-8 text-center sm:text-left">Edit Post</h1>
          {submitError && (
            <div className="mb-6 p-4 bg-error-100 text-error-700 border border-error-300 rounded-md">
              <p><strong className="font-semibold">Error:</strong> {submitError}</p>
            </div>
          )}
          <PostForm 
            initialData={post} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitButtonText="Save Changes"
          />
        </div>
      </div>
    </Layout>
  );
}
