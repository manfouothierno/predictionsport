'use client';

import { useState } from 'react';
import { Search, Tag, Calendar, Filter, ArrowRight } from 'lucide-react';
import {  Button, Card, Avatar } from "@nextui-org/react";
import {useRouter} from "next/navigation";
import Navbar from "@/app/[lang]/langing/Navbar";
import Image from "next/image";

const blogCategories = [
    { id: 'all', name: 'All Posts' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'predictions', name: 'Predictions' },
    { id: 'tactics', name: 'Tactics' }
];

const mockPosts = [
    {
        id: 1,
        slug: 'understanding-modern-football-tactics',
        title: 'Understanding Modern Football Tactics',
        excerpt: 'An in-depth analysis of modern tactical trends...',
        category: 'Tactics',
        image: '/blog/1.jpg',
        date: 'Jan 27, 2025',
        author: {
            name: 'John Smith',
            avatar: '/avatars/john.jpg',
            role: 'Tactical Analyst'
        },
        readTime: '5 min read',
        tags: ['Tactics', 'Analysis']
    },
    {
        id: 2,
        slug: 'understanding-modern-football-tactics',
        title: 'Understanding Modern Football Tactics',
        excerpt: 'An in-depth analysis of modern tactical trends...',
        category: 'Tactics',
        image: '/blog/1.jpg',
        date: 'Jan 27, 2025',
        author: {
            name: 'John Smith',
            avatar: '/avatars/john.jpg',
            role: 'Tactical Analyst'
        },
        readTime: '5 min read',
        tags: ['Tactics', 'Analysis']
    },
    {
        id: 3,
        slug: 'understanding-modern-football-tactics',
        title: 'Understanding Modern Football Tactics',
        excerpt: 'An in-depth analysis of modern tactical trends...',
        category: 'Tactics',
        image: '/blog/1.jpg',
        date: 'Jan 27, 2025',
        author: {
            name: 'John Smith',
            avatar: '/avatars/john.jpg',
            role: 'Tactical Analyst'
        },
        readTime: '5 min read',
        tags: ['Tactics', 'Analysis']
    },
    {
        id: 4,
        slug: 'understanding-modern-football-tactics',
        title: 'Understanding Modern Football Tactics',
        excerpt: 'An in-depth analysis of modern tactical trends...',
        category: 'Tactics',
        image: '/blog/1.jpg',
        date: 'Jan 27, 2025',
        author: {
            name: 'John Smith',
            avatar: '/avatars/john.jpg',
            role: 'Tactical Analyst'
        },
        readTime: '5 min read',
        tags: ['Tactics', 'Analysis']
    },
    {
        id: 5,
        slug: 'understanding-modern-football-tactics',
        title: 'Understanding Modern Football Tactics',
        excerpt: 'An in-depth analysis of modern tactical trends...',
        category: 'Tactics',
        image: '/blog/1.jpg',
        date: 'Jan 27, 2025',
        author: {
            name: 'John Smith',
            avatar: '/avatars/john.jpg',
            role: 'Tactical Analyst'
        },
        readTime: '5 min read',
        tags: ['Tactics', 'Analysis']
    },

];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="bg-white pt-20 border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Football Insights Blog</h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Expert analysis, tactical breakdowns, and predictions from our team of analysts
                            </p>
                            <div className="mt-6 flex space-x-4">
                                <Button color="danger">Latest Posts</Button>
                                <Button variant="bordered">Subscribe</Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                            <img
                                src="/pexels-pixabay-274422.jpg"
                                alt="Blog Header"
                                width={1000}
                                height={500}
                                className="rounded-xl shadow-lg w-full h-64 object-cover object-center"

                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <div className="flex gap-4 overflow-x-auto">
                        {blogCategories.map((category) => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "solid" : "light"}
                                color={activeCategory === category.id ? "danger" : "default"}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                            />
                        </div>
                        <Button isIconOnly variant="bordered">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockPosts.map((post) => (
                        <Card
                            key={post.id}
                            className="group"
                        >
                            <div className="relative h-48">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Avatar
                                        src={post.author.avatar}
                                        size="sm"
                                    />
                                    <div>
                                        <div className="text-sm font-medium">{post.author.name}</div>
                                        <div className="text-xs text-gray-500">{post.author.role}</div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {post.date}
                                        </div>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        size="sm"
                                        endContent={<ArrowRight className="w-4 h-4" />}
                                        onClick={() => router.push(`/blog/${post.slug}`)}
                                    >
                                        Read
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <Button
                        color="danger"
                        variant="bordered"
                        size="lg"
                        endContent={<ArrowRight className="w-4 h-4" />}

                    >
                        Load More Posts
                    </Button>
                </div>
            </div>
        </div>
    );
}