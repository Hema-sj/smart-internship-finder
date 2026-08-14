import { useMemo, useState } from 'react';
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import PopularLocations from '../components/PopularLocations';
import InternshipSearch from '../components/InternshipSearch';
import InternshipTable from '../components/InternshipTable';
import DreamCompanyCard from '../components/DreamCompanyCard';
import SkillRequirements from '../components/SkillRequirements';
import ResumeBuilderCard from '../components/ResumeBuilderCard';
import SkillRecommendations from '../components/SkillRecommendations';
import FeatureSummary from '../components/FeatureSummary';
import Footer from '../components/Footer';
import { internships } from '../data/internships';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const filteredInternships = useMemo(() => internships.filter(internship => (type === 'All' || internship.type === type) && `${internship.title} ${internship.company} ${internship.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query, type]);
  return <div className="space-y-16"><HeroSection/><StatsCards/><PopularLocations/><InternshipSearch query={query} setQuery={setQuery} type={type} setType={setType}/><InternshipTable internships={filteredInternships}/><DreamCompanyCard/><SkillRequirements/><ResumeBuilderCard/><SkillRecommendations/><FeatureSummary/><Footer/></div>;
}
