'use client';

import { notFound } from 'next/navigation';
import { ChevronLeft, Share2, Bookmark, Tag, Calendar, Clock } from 'lucide-react';
import { Button, Avatar, Card } from "@nextui-org/react";

interface BlogDetailProps {
    params: {
        slug: string;
    };
}

async function getBlogPost(slug: string) {
    // Fetch blog post from API/CMS
    return {
        title: "Understanding Modern Football Tactics",
        slug: "understanding-modern-football-tactics",
        content: `<p>Blog content goes here...</p>`,
        publishDate: "January 27, 2025",
        readTime: "5 min read",
        category: "Tactics",
        tags: ["Tactics", "Analysis", "Modern Football"],
        author: {
            name: "John Smith",
            role: "Tactical Analyst",
            avatar: "/avatars/john.jpg",
            bio: "Football analyst with 10+ years experience"
        },
        relatedPosts: [
            {
                id: 1,
                title: "The Evolution of False 9",
                excerpt: "How the false 9 role has evolved...",
                image: "/blog/1.jpg",
                date: "2h ago",
                readTime: "4 min read",
                category: "Tactics"
            }
        ]
    };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
    const post = await getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button
                        href="/blog"
                        as="a"
                        variant="light"
                        startContent={<ChevronLeft className="w-4 h-4" />}
                        className="text-gray-600"
                    >
                        Back to Blog
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <article>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full"
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-between py-6 border-y">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={post.author.avatar}
                                        size="lg"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{post.author.name}</div>
                                        <div className="text-sm text-gray-500">{post.author.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {post.publishDate}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-96">
                            <img
                                src="/blog/featured.jpg"
                                alt="Featured"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="prose prose-lg max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-8 border-t">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="bordered"
                                        startContent={<Share2 className="w-4 h-4" />}
                                    >
                                        Share Article
                                    </Button>
                                    <Button
                                        variant="bordered"
                                        startContent={<Bookmark className="w-4 h-4" />}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar src={post.author.avatar} size="lg" />
                            <div>
                                <h3 className="font-medium text-gray-900">Written by {post.author.name}</h3>
                                <p className="text-gray-500 mt-1">{post.author.bio}</p>
                            </div>
                        </div>
                    </div>

                    {post.relatedPosts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {post.relatedPosts.map((relatedPost) => (
                                    <Card key={relatedPost.id} className="group">
                                        <div className="relative h-48">
                                            <img
                                                src={relatedPost.image}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">
                          {relatedPost.category}
                        </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{relatedPost.date}</span>
                                                <span>{relatedPost.readTime}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}