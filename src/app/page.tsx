import Hero from "@/components/sections/Hero";
import FiliereCards from "@/components/sections/FiliereCards";
import LatestCourses from "@/components/sections/LatestCourses";
import TechPulse from "@/components/sections/TechPulse";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FiliereCards />
      <LatestCourses />
      <TechPulse />
    </>
  );
}
