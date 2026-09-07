import React from 'react';
import { Hero } from '../components/home/Hero';
import { SearchBar } from '../components/home/SearchBar';
import { CourseSection } from '../components/home/CourseSection';
import { BranchSlider } from '../components/home/BranchSlider';
import { FeaturedBooks } from '../components/home/FeaturedBooks';
import { CampusSection } from '../components/home/CampusSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyCampusBook } from '../components/home/WhyCampusBook';
import { SellCTA } from '../components/home/SellCTA';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <SearchBar />
      <CourseSection />
      <BranchSlider />
      <FeaturedBooks />
      <CampusSection />
      <HowItWorks />
      <WhyCampusBook />
      <SellCTA />
    </div>
  );
};
