import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { AboutSection } from "@/components/site/about-section";
import { JoinCtaSection } from "@/components/site/join-cta-section";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <SiteNav />
      <main>
        <Hero />
        <HowItWorksSection />
        <AboutSection />
        <JoinCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
