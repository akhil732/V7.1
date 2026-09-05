import React from 'react';
import { LoginScreen } from '../components/LoginScreen';

interface LoginPageProps {
  onBack?: () => void;
  onNavigatePage: (page: string) => void;
  language?: 'en' | 'hi' | 'te';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onNavigatePage, language }) => {
  return (
    <LoginScreen
      onBack={onBack}
      onNavigatePage={onNavigatePage}
      language={language}
    />
  );
};

export default LoginPage;
