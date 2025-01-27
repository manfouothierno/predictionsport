'use client';

import { useState } from 'react';
import { Search, Calendar, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Chip, Button } from "@nextui-org/react";
import {useRouter} from "next/navigation";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/app/[lang]/langing/Navbar";

const newsCategories = [
    { id: 'all', name: 'All News' },
    { id: 'transfers', name: 'Transfers' },
    { id: 'injuries', name: 'Injuries' },
    { id: 'analysis', name: 'Analysis' }
];

const mockNews = [
    {
        id: 1,
        slug: 'star-player-returns-to-training-after-long-term-injury',
        title: 'Star Player Returns to Training After Long-Term Injury',
        excerpt: 'Key midfielder back in full training, boost for upcoming crucial matches...',
        category: 'Injuries',
        image: '/news/1.jpg',
        date: '2h ago',
        readTime: '3 min read',
        isFeatured: true
    },

];

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState('all');

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white">
                <Navbar/>
                <div className="pt-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Latest News</h1>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex gap-6 overflow-x-auto py-4">
                            {newsCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center gap-2 pb-2 px-1 ${
                                        activeCategory === category.id
                                            ? 'text-red-600 border-b-2 border-red-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span className="font-medium">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured News */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden group">
                            <div className="relative h-80">
                                <img
                                    src="/featured-news.jpg"
                                    alt="Featured News"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 p-6 text-white">
                                    <Chip color="danger" size="sm" className="mb-3">Breaking News</Chip>
                                    <h2 className="text-2xl font-bold mb-2">Major Transfer Update: Star Player Set to Move</h2>
                                    <p className="text-gray-200 line-clamp-2 mb-4">
                                        Breaking news as negotiations reach final stages for the transfer of the season...
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            2h ago
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            5 min read
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest News */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
                        {mockNews.map((news) => (
                            <NewsCard
                                id={news.id}
                                slug={news.slug}
                                title={news.title}
                                excerpt={news.excerpt}
                                category={news.category}
                                image={news.image}
                                date={news.date}
                                readTime={news.readTime}
                            />
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {[...Array(6)].map((_, i) => (
                        <NewsCard
                            id={i+1}
                            slug={`news-${i+1}`}
                            title="Star Player Returns to Training"
                            excerpt="Key midfielder back in training..."
                            category="Injuries"
                            image="/news/1.jpg"
                            date="2h ago"
                            readTime="3 min read"
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <Button
                        color="danger"
                        variant="bordered"
                        size="lg"
                        endContent={<ArrowRight className="w-4 h-4" />}
                        onClick={() => router.push('/news')}
                    >
                        Load More News
                    </Button>
                </div>
            </div>
        </div>
    );
}