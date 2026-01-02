'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-md space-y-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Application Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error.message || 'A critical error occurred'}
            </p>
            {error.digest && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
