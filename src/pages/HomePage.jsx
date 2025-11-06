import { useEffect } from "react";
import { useLocation } from "react-router";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Testimonial from "@/components/Testimonial";
import ExploreTask from "@/components/ExploreTask";
import FeaturedCommunities from "@/components/FeaturedCommunities";
import Metrics from "@/components/Metrics";
import CreateWorkAndEarn from "@/components/CreateWorkAndEarn";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Delay to ensure element is mounted
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />

      <Metrics />

      <About />

      <ExploreTask />

      <CreateWorkAndEarn />

      <FeaturedCommunities />

      <Testimonial />
    </>
  );
}

export default HomePage;
