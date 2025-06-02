import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'Personal Blog Dashboard', hideHeaderFooter }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder, replace with actual session check

  // Simulate session check - replace with actual logic e.g. fetching from /api/auth/session
  useEffect(() => {
    const checkSession = () => {
      try {
        // In a real app, you'd fetch from an endpoint like /api/auth/session
        // For now, we'll check a simple localStorage item or assume logged in if not on auth pages
        // This is NOT secure and for placeholder purposes only.
        const token = localStorage.getItem('userToken'); // Example, not a secure practice
        if (token) {
          setIsLoggedIn(true);
        } else {
          // if not on login/signup, and no token, redirect to login
          // This is a basic client-side redirect, proper auth flow is more complex
          if (router.pathname !== '/login' && router.pathname !== '/signup') {
            // setIsLoggedIn(false); // already false
            // router.push('/login'); // Potentially too aggressive for initial setup
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [router.pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('userToken'); // Clear placeholder token
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., display a message)
    }
  };

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/posts', label: 'Posts' },
    { href: '/categories', label: 'Categories' },
    { href: '/tags', label: 'Tags' },
  ];

  if (hideHeaderFooter) {
    return <main className="bg-neutral-light-gray min-h-screen">{children}</main>;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Manage your personal blog content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral-light-gray">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/"
              className="text-2xl font-bold font-display text-primary hover:text-blue-700 transition-colors">
              MyBlog
            </Link>
            <div className="space-x-4 flex items-center">
              {isLoggedIn && navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
                               ${router.pathname === link.href 
                                 ? 'bg-primary text-white' 
                                 : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                    {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-feedback-error transition-colors border border-gray-300 hover:border-feedback-error"
                >
                  Logout
                </button>
              ) : (
                <>
                  {router.pathname !== '/login' && (
                     <Link href="/login"
                        className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-blue-700 transition-colors">
                            Login
                    </Link>
                  )}
                  {router.pathname !== '/signup' && (
                    <Link href="/signup"
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-300 transition-colors">
                            Sign Up
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 text-center py-6">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Personal Blog. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
