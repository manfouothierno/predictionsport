// app/[lang]/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from "@nextui-org/react";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full px-6 py-12 bg-white rounded-xl shadow-lg text-center">
                <div className="w-24 h-24 mx-auto mb-6">
                    <svg
                        className="w-full h-full text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Something went wrong!
                </h1>

                <p className="text-gray-600 mb-8">
                    An unexpected error occurred. We've been notified and are working to fix the issue.
                </p>

                <div className="space-y-4">
                    <Button
                        color="danger"
                        variant="solid"
                        size="lg"
                        className="w-full"
                        onClick={() => reset()}
                    >
                        Try Again
                    </Button>

                    <Button
                        color="danger"
                        variant="light"
                        size="lg"
                        className="w-full"
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Homepage
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <p className="text-sm text-gray-500">
                        Error Code: {error.digest}
                    </p>
                </div>
            </div>
        </div>
    );
}