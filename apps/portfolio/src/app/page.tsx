import { AboutTeaser } from "@/components/sections/about-teaser";
import { Beleza } from "@/components/sections/beleza";
import { Faq } from "@/components/sections/faq";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { LandingPages } from "@/components/sections/landing-pages";
import { Personalizer } from "@/components/sections/personalizer";
import { Process } from "@/components/sections/process";
import { Solutions } from "@/components/sections/solutions";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ description: siteConfig.description, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Beleza />
      <LandingPages />
      <Solutions />
      <Personalizer />
      <Process />
      <AboutTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}
