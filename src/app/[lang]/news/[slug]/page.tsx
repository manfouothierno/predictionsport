'use client';

import { notFound } from 'next/navigation';
import { ChevronLeft, Clock, Share2, Bookmark, Eye } from 'lucide-react';
import { Button, Avatar } from "@nextui-org/react";
import NewsCard from '@/components/NewsCard';

interface NewsDetailProps {
    params: {
        slug: string;
    };
}

async function getNewsDetail(slug: string) {
    // Fetch news detail from API
    return {
        title: "Star Player Returns to Training After Long-Term Injury",
        slug: "star-player-returns",
        subtitle: "Major boost for upcoming crucial matches as key midfielder returns to full training",
        publishDate: "January 27, 2025",
        readTime: "3 min read",
        views: "2.5K",
        category: "Injuries",
        author: {
            name: "John Smith",
            role: "Senior Sports Analyst",
            avatar: "/avatars/john.jpg"
        },
        content: `<p>Detailed article content goes here...</p>`,
        relatedArticles: [
            {
                id: 1,
                title: "Transfer News: Latest Updates",
                excerpt: "Breaking transfer news and updates...",
                image: "/news/1.jpg",
                date: "2h ago",
                readTime: "5 min read",
                category: "Transfers"
            }
        ]
    };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
    const article = await getNewsDetail(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button
                        href="/news"
                        as="a"
                        variant="light"
                        startContent={<ChevronLeft className="w-4 h-4" />}
                        className="text-gray-600"
                    >
                        Back to News
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                {article.category}
              </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {article.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-6">
                            {article.subtitle}
                        </p>

                        <div className="flex items-center justify-between border-y py-4">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    src={article.author.avatar}
                                    size="sm"
                                />
                                <div>
                                    <div className="font-medium text-gray-900">{article.author.name}</div>
                                    <div className="text-sm text-gray-500">{article.author.role}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {article.readTime}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    {article.views}
                                </div>
                                <div className="text-gray-300">|</div>
                                <div>{article.publishDate}</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-96">
                        <img
                            src="/news/featured.jpg"
                            alt="Featured"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-8 border-t">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="bordered"
                                    startContent={<Share2 className="w-4 h-4" />}
                                >
                                    Share
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
                </article>

                {article.relatedArticles.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {article.relatedArticles.map((relatedArticle) => (
                                <NewsCard
                                    key={relatedArticle.id}
                                    {...relatedArticle}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}