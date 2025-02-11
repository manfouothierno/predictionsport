// app/[lang]/not-found.tsx
'use client';

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function NotFound() {
    const router = useRouter();

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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>

                <p className="text-gray-600 mb-8">
                    Sorry, we couldn't find the page you're looking for. The page might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="space-y-4">
                    <Button
                        color="danger"
                        variant="solid"
                        size="lg"
                        className="w-full"
                        onClick={() => router.push('/')}
                    >
                        Go to Homepage
                    </Button>

                    <Button
                        color="danger"
                        variant="light"
                        size="lg"
                        className="w-full"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <p className="text-sm text-gray-500">
                        If you think this is a mistake, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
}