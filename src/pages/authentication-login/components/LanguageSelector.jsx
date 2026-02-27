import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setIsOpen(false);
    // In a real app, this would trigger a language change
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-text-secondary hover:text-text-primary"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        <Icon name="ChevronDown" size={16} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50">
          <div className="p-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md
                  transition-colors duration-200
                  ${currentLanguage === language.code 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1 text-left font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <Icon name="Check" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;