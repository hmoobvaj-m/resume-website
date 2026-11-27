import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Experience from "@/components/sections/Experience";
import ContactMe from "@/components/sections/ContactMe";
import SkillsSection from "@/components/sections/SkillsSection";

export default function HomePage() {
    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-foreground"
            >
                Skip to content
            </a>

            <Header />

            <main id="main-content" tabIndex={-1}>
                <HeroSection />
                <Experience />
                <FeaturedProjects />
                <SkillsSection />
                <ContactMe />
            </main>

            <Footer />
        </>
    );
}