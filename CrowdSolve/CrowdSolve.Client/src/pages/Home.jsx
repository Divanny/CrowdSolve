import HeroSection from "@/components/landing-page/HeroSection";
import CrowdSourcingEasy from "@/components/landing-page/CrowdSourcingEasy";
import TrustedBySection from "@/components/landing-page/TrustedBySection";
import WhyClientsLoveUs from "@/components/landing-page/WhyClientsLoveUs";
import ChallengesPost from "@/components/landing-page/ChallengesPost";
import FAQSection from "@/components/landing-page/FAQSection";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

function Home() {
    return (
        <div className="">
            <ScrollAnimationWrapper>
                <HeroSection />
            </ScrollAnimationWrapper>
            <CrowdSourcingEasy />
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
        </div>
    );
}

export default Home;