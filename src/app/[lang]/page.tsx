'use client';

import HeroSection from "@/app/[lang]/langing/HeroSection";
import Navbar from "@/app/[lang]/langing/Navbar";
import TopPredictions from "@/app/[lang]/langing/TopPredictions";
import PopularLeagues from "@/app/[lang]/langing/PopularLeagues";
import NewsHighlights from "@/app/[lang]/langing/NewsHighlights";
import PerformanceMetrics from "@/app/[lang]/langing/PerformanceMetrics";
import NewsletterSignup from "@/app/[lang]/langing/NewsletterSignup";
import Footer from "@/app/[lang]/langing/Footer";
import PromotionalBanner from "@/components/PromotionalBanner";
import UpcomingMatches from "@/components/UpcomingMatches";



export default function Home() {

  return (
    <div >
        <Navbar />

        {/*<HeroSection />*/}
        <UpcomingMatches limit={12} sport="Football" />
        {/*<PopularLeagues />*/}
        <NewsHighlights/>
        {/*<PerformanceMetrics/>*/}
        <NewsletterSignup/>

    </div>
  );
}
