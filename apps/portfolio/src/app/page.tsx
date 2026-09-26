import { AboutTeaser } from "@/components/sections/about-teaser";
import { Benefits } from "@/components/sections/benefits";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Solutions } from "@/components/sections/solutions";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ description: siteConfig.description, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Solutions />
      <FeaturedProjects />
      <Process />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
