import HeroSection from "@/components/sections/HeroSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Experience from "@/components/sections/Experience";
import ContactMe from "@/components/sections/ContactMe";
import SkillsSection from "@/components/sections/SkillsSection";

export default function HomePage() {
    return (
        <>
            <main>
                <HeroSection />
                <Experience />
                <FeaturedProjects />
                <SkillsSection />
                <ContactMe />
            </main>

            <footer className="mt-8 border-t border-neutral-800 py-8 text-center text-sm text-neutral-500">
                Personal portfolio &amp; resume
            </footer>
        </>
    );
}