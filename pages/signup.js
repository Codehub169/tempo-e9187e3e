import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';
import Layout from '@/components/Layout';

export default function SignupPage() {
  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold font-display text-neutral-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-600">
              Or{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                sign in to your existing account
              </Link>
            </p>
          </div>
          <AuthForm mode="signup" />
        </div>
      </div>
    </Layout>
  );
}
