'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN ERROR BOUNDARY CAUGHT ERROR:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-xl shadow-sm border border-red-100 p-8">
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan Server</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Kami tidak dapat memuat halaman ini. Silakan coba lagi atau hubungi tim teknis.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl mb-6 overflow-auto text-sm font-mono text-gray-700">
        <p className="font-bold text-red-500 mb-2">Error Details:</p>
        <p>{error.message}</p>
        <p className="mt-2 text-xs text-gray-400">Digest: {error.digest}</p>
        {error.stack && (
          <pre className="mt-4 text-xs whitespace-pre-wrap text-left text-gray-500">{error.stack}</pre>
        )}
      </div>

      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
