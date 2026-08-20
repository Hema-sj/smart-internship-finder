import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import PopularLocations from '../components/PopularLocations';
import InternshipListing from '../components/InternshipListing';
import DreamCompanyCard from '../components/DreamCompanyCard';
import SkillRequirements from '../components/SkillRequirements';
import ResumeBuilderCard from '../components/ResumeBuilderCard';
import SkillRecommendations from '../components/SkillRecommendations';
import FeatureSummary from '../components/FeatureSummary';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <StatsCards />
      <PopularLocations />
      <InternshipListing compact pageSize={8} title="Recommended Internships" syncUrl={false} />
      <DreamCompanyCard />
      <SkillRequirements />
      <ResumeBuilderCard />
      <SkillRecommendations />
      <FeatureSummary />
      <Footer />
    </div>
  );
}
