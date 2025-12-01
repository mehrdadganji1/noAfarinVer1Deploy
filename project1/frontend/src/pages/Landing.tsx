import { FC } from 'react';
import { HeroFuturistic } from '@/components/landing/futuristic/HeroFuturistic';
import { ProgramInfoSection } from '@/components/landing/premium/ProgramInfo';
import { AACOSection } from '@/components/landing/premium/AACOSection';
import { StatsPremium } from '@/components/landing/premium/StatsPremium';
import Footer from '@/components/landing/Footer';

const Landing: FC = () => {
  console.log('🎯 Landing Premium component rendering...');
  
  return (
    <div className="min-h-screen">
      <HeroFuturistic />
      <ProgramInfoSection />
      <AACOSection />
      <StatsPremium />
      <Footer />
    </div>
  );
};

export default Landing;
