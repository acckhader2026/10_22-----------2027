import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverPage } from '../components/CoverPage';

interface HomePageProps {
  onOpenAnalysis?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAnalysis }) => {
  const navigate = useNavigate();

  return (
    <CoverPage
      onStartReading={() => navigate('/curriculum')}
      onOpenAnalysis={onOpenAnalysis || (() => navigate('/curriculum'))}
    />
  );
};
