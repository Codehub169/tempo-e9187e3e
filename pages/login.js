import AuthForm from '../components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold font-display text-neutral-dark-gray">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-dark-gray">
            Or{' '}
            <Link href="/signup" legacyBehavior>
              {/* Uses primary.600 and primary.DEFAULT (for hover), which are now defined */}
              <a className="font-medium text-primary-600 hover:text-primary">
                create a new account
              </a>
            </Link>
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
