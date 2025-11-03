"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/app/[lang]/langing/Navbar";
import TopPromoBanner from "@/components/TopPromoBanner";
import NewsHighlights from "@/app/[lang]/langing/NewsHighlights";
import NewsletterSignup from "@/app/[lang]/langing/NewsletterSignup";
import FeaturedPredictions from "@/components/FeaturedPredictions";

export default function Home() {
  const { locale, dictionary } = useLanguage();

  return (
    <div>
      <Navbar />
      <TopPromoBanner />

      {/* Featured Predictions Section with Sidebar Filters */}
      <div className="pt-32 md:pt-36">
        <FeaturedPredictions locale={locale} dictionary={dictionary} />

        {/* News Highlights Section */}
        <NewsHighlights />

        {/* Newsletter Signup Section */}
        <NewsletterSignup />
      </div>
    </div>
  );
}
