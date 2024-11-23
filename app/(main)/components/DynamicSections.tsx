'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from 'react';

// Skeleton component
const SectionSkeleton = () => (
  <div className="space-y-4 p-8">
    <Skeleton className="h-8 w-1/3 mx-auto" />
    <Skeleton className="h-4 w-2/3 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  </div>
);

// Dynamic imports with loading fallbacks
const HeroSection = dynamic(() => import("@/components/sections/hero").then(mod => ({ 
  default: mod.HeroSection 
})), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

const TrustedBySection = dynamic(() => import("@/components/sections/trusted-by").then(mod => ({ default: mod.TrustedBySection })), {
  loading: () => <SectionSkeleton />
});

const WhyChooseUsSection = dynamic(() => import("@/components/sections/why-choose-us").then(mod => ({ default: mod.WhyChooseUsSection })), {
  loading: () => <SectionSkeleton />
});

const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials").then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <SectionSkeleton />
});

const FeaturesSection = dynamic(() => import("@/components/sections/features").then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <SectionSkeleton />
});

const FAQsSection = dynamic(() => import("@/components/sections/faqs").then(mod => ({ default: mod.FAQsSection })), {
  loading: () => <SectionSkeleton />
});

const ReviewsSection = dynamic(() => import("@/components/sections/reviews").then(mod => ({ default: mod.ReviewsSection })), {
  loading: () => <SectionSkeleton />
});

const PackagesSection = dynamic(() => import("@/components/sections/packages").then(mod => ({ default: mod.PackagesSection })), {
  loading: () => <SectionSkeleton />
});

const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => ({ default: mod.ContactSection })), {
  loading: () => <SectionSkeleton />
});

const ComparisonSection = dynamic(() => import("@/components/sections/comparison").then(mod => ({ default: mod.ComparisonSection })), {
  loading: () => <SectionSkeleton />
});

const HomeAnalytics = dynamic(() => import("@/components/analytics/home-analytics").then(mod => ({ default: mod.HomeAnalytics })));
const CouponDialog = dynamic(() => import("@/components/coupon/CouponDialog").then(mod => ({ default: mod.CouponDialog })));

export function DynamicSections() {
  return (
    <div className="relative">
      <Suspense fallback={null}>
        <HomeAnalytics />
        <CouponDialog />
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <WhyChooseUsSection />
        <ComparisonSection />
        <ReviewsSection />
        <PackagesSection />
        <TestimonialsSection />
        <FAQsSection />
        <ContactSection />
      </Suspense>
    </div>
  );
}
