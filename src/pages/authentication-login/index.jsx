import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import SecurityInfo from './components/SecurityInfo';
import LanguageSelector from './components/LanguageSelector';
import LoginFooter from './components/LoginFooter';

const AuthenticationLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      // Language would be applied here in a real app
    }

    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    
    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user session
      localStorage.setItem('userSession', JSON.stringify({
        email: credentials.email,
        loginTime: new Date().toISOString(),
        rememberMe: credentials.rememberMe
      }));

      // Navigate to dashboard
      navigate('/caregiver-management-dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={24} color="white" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-text-primary">CaregiverRegistry</span>
              <span className="text-xs text-text-secondary font-normal">Sistema de Gestión</span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-lg">
              <Icon name="Clock" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary font-mono">
                {currentTime.toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Security Info */}
            <div className="hidden lg:block">
              <div className="max-w-md mx-auto">
                <SecurityInfo />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-surface border border-border rounded-xl shadow-elevated p-8">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="LogIn" size={32} className="text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Iniciar Sesión
                  </h1>
                  <p className="text-text-secondary">
                    Accede al sistema de gestión de cuidadores
                  </p>
                </div>

                {/* Login Form */}
                <LoginForm onLogin={handleLogin} isLoading={isLoading} />

                {/* Mobile Security Info */}
                <div className="lg:hidden mt-8 pt-8 border-t border-border">
                  <SecurityInfo />
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={16} />
                    <span>1,247 usuarios activos</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={16} />
                    <span>100% seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <LoginFooter />
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 flex items-center space-x-4">
            <Icon name="Loader" size={24} className="text-primary animate-spin" />
            <span className="text-text-primary font-medium">
              Verificando credenciales...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationLogin;