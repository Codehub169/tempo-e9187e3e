import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PostForm from '@/components/posts/PostForm';
// import { useSession, getSession } from 'next-auth/react'; // Example for session handling

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Example: const { data: session, status } = useSession();
  // useEffect(() => {
  //   if (status === 'loading') return; // Do nothing while loading
  //   if (status === 'unauthenticated') {
  //     router.push('/login');
  //   }
  //   // Alternatively, for server-side redirection or stricter checks:
  //   // const checkSession = async () => {
  //   //   const session = await getSession();
  //   //   if (!session) {
  //   //     router.push('/login');
  //   //   }
  //   // };
  //   // checkSession();
  // }, [status, router]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse, default to empty
        throw new Error(errorData.message || `Failed to create post. Status: ${response.status}`);
      }

      router.push('/posts'); 
    } catch (err) {
      setError(err.message);
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (status === 'loading' || (status === 'authenticated' && !session)) { // Prevent rendering form until session is confirmed
  //   return <Layout><div className="flex justify-center items-center h-screen-minus-header"><LoadingSpinner/></div></Layout>;
  // }
  // if (status === 'unauthenticated') return null; // Or a message, redirect is handled above

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-800 mb-6 sm:mb-8 text-center sm:text-left">Create New Post</h1>
          {error && (
            <div className="mb-6 p-4 bg-error-100 text-error-700 border border-error-300 rounded-md">
              <p><strong className="font-semibold">Error:</strong> {error}</p>
            </div>
          )}
          <PostForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitButtonText="Create Post"
          />
        </div>
      </div>
    </Layout>
  );
}
