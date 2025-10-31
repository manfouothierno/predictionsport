'use client';

import {useEffect, useState} from 'react';
import { Search, Calendar, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Chip, Button } from "@nextui-org/react";
import {useRouter} from "next/navigation";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/app/[lang]/langing/Navbar";
import TopPromoBanner from "@/components/TopPromoBanner";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";

const newsCategories = [
    { id: 'all', name: 'All News' },
    // { id: 'transfers', name: 'Transfers' },
    // { id: 'injuries', name: 'Injuries' },
    // { id: 'analysis', name: 'Analysis' }
];



export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [feed, setFeed] = useState<any>(null);

    const router = useRouter();

    const getNews = async () => {
        setLoading(true);
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://newsrss.bbc.co.uk/rss/sportonline_uk_edition/football/rss.xml');
        const data = await response.json();
        console.log(data);
        setNews(data.items);
        setFeed(data.items[0]);
        setLoading(false);
        setError(false);
        return data.items;
    };

    useEffect(() => {
        getNews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white">
                <Navbar/>
                <TopPromoBanner/>
                <div className="pt-32 md:pt-36">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Latest News</h1>
                            {/*<div className="relative w-full md:w-64">*/}
                            {/*    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        placeholder="Search news..."*/}
                            {/*        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"*/}
                            {/*    />*/}
                            {/*</div>*/}
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
                                    src={feed?.thumbnail}
                                    alt="Featured News"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 p-6 text-white">
                                    <Chip color="danger" size="sm" className="mb-3">Breaking News</Chip>
                                    <h2 className="text-2xl font-bold mb-2">{feed?.title}</h2>
                                    <p className="text-gray-200 line-clamp-2 mb-4">
                                        {feed?.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {feed?.pubDate && formatDistanceToNow(feed?.pubDate, { addSuffix: true })}
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            <Link href={feed?.link ?? '#'} target="_blank" rel="noopener noreferrer">
                                                Read more
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest News */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
                        {news.splice(0,1).map((newsItem, index) => (
                            <NewsCard
                                id={index + 1}
                                slug={newsItem.link}
                                title={newsItem.title}
                                excerpt={newsItem.excerpt}
                                category={newsItem.category}
                                image={newsItem.thumbnail}
                                date={newsItem?.pubDate && formatDistanceToNow(newsItem?.pubDate, { addSuffix: true })}
                                readTime={newsItem.readTime}
                            />
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {news.map((newsItem, index) => (
                        <NewsCard
                            id={index + 1}
                            slug={newsItem.link}
                            title={newsItem.title}
                            excerpt={newsItem.description}
                            category={newsItem.category}
                            image={newsItem.thumbnail}
                            date={newsItem?.pubDate && formatDistanceToNow(newsItem?.pubDate, { addSuffix: true })}
                            readTime={newsItem.readTime}
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