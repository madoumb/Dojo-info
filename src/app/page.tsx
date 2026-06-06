import Hero from "@/components/sections/Hero";
import FiliereCards from "@/components/sections/FiliereCards";
import LatestCourses from "@/components/sections/LatestCourses";
import TechNewsCarousel from "@/components/sections/TechNewsCarousel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FiliereCards />
      <TechNewsCarousel />
      <LatestCourses />
    </>
  );
}
