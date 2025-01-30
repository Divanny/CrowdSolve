import HeroSection from "@/components/landing-page/HeroSection";
import CrowdSourcingEasy from "@/components/landing-page/CrowdSourcingEasy";
import TrustedBySection from "@/components/landing-page/TrustedBySection";
import WhyClientsLoveUs from "@/components/landing-page/WhyClientsLoveUs";
import ChallengesPost from "@/components/landing-page/ChallengesPost";
import FAQSection from "@/components/landing-page/FAQSection";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

function Home() {
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="overflow-x-hidden">
            <ScrollAnimationWrapper>
                <HeroSection />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <CrowdSourcingEasy />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <TrustedBySection />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <WhyClientsLoveUs />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <ChallengesPost />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <FAQSection />
            </ScrollAnimationWrapper>
            <AnimatePresence>
                {showScroll && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-5 right-5 p-3"
                    >
                        <Button className="shadow-lg" size="icon" onClick={scrollToTop}>
                            <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;