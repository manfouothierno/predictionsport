// components/NewsCard.tsx
'use client';

import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Chip, Button } from "@nextui-org/react";
import {useRouter} from "next/navigation";
import { motion } from 'framer-motion';

interface NewsCardProps {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    isFeatured?: boolean;
}

export default function NewsCard({
                                     title,
                                     slug,
                                     excerpt,
                                     category,
                                     image,
                                     date,
                                     readTime,
                                     isFeatured
                                 }: NewsCardProps) {
    const router = useRouter();
    return (
        <motion.article className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative h-48">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Chip
                    color="primary"
                    size="sm"
                    className="absolute top-4 left-4"
                >
                    {category}
                </Chip>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {date}
                        </div>
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {readTime}
                        </div>
                    </div>
                    <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        endContent={<ArrowRight className="w-4 h-4" />}
                        onClick={() => router.push(`${slug}`)}
                    >
                        Read More
                    </Button>
                </div>
            </div>
        </motion.article>
    );
}