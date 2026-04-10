import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductGallery from "@/components/ProductGallery";
import SuperstructuresSection from "@/components/SuperstructuresSection";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollRevealSection from "@/components/ScrollRevealSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ScrollRevealSection>
        <Hero />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.05}>
        <ProductGallery />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.08}>
        <SuperstructuresSection />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.1}>
        <Features />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.12}>
        <About />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.14}>
        <Testimonials />
      </ScrollRevealSection>
      <ScrollRevealSection delay={0.16}>
        <CTA />
      </ScrollRevealSection>
      <Footer />
    </main>
  );
}
