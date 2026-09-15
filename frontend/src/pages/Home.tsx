import { SEO } from '../lib/seo';
import { Hero } from '../components/home/Hero';
import { TrustMarquee } from '../components/home/TrustMarquee';
import { WhatWeDo } from '../components/home/WhatWeDo';
import { ServicesSection } from '../components/home/ServicesSection';
import { GrowthSection } from '../components/home/GrowthSection';
import { Service3DExperience } from '../components/home/Service3DExperience';
import { WhyBisstech } from '../components/home/WhyBisstech';
import { ProcessSection } from '../components/home/ProcessSection';
import { TechnologiesSection } from '../components/home/TechnologiesSection';
import { CaseStudiesSection } from '../components/home/CaseStudiesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CTASection } from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <SEO
        title="BISSTECH — Digital Growth, Technology, AI & Creative Agency"
        description="BISSTECH helps ambitious businesses grow through digital marketing, high-performance websites, e-commerce & quick commerce management, AI automation and creative design. Build. Grow. Automate."
      />
      <main>
        <Hero />
        <TrustMarquee />
        <WhatWeDo />
        <ServicesSection />
        <GrowthSection />
        <Service3DExperience />
        <WhyBisstech />
        <ProcessSection />
        <TechnologiesSection />
        <CaseStudiesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
}
