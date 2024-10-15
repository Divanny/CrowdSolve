import About from "@/components/about-us/About";
import MeetOurTeam from "@/components/about-us/MeetOurTeam";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

function Home() {
    return (
        <div className="">
            <ScrollAnimationWrapper>
                <About />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
                <MeetOurTeam />
            </ScrollAnimationWrapper>
        </div>
    );
}

export default Home;