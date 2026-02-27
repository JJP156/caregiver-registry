import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const mockCredentials = {
    admin: { email: 'admin@caregiverregistry.com', password: 'Admin123!' },
    hr: { email: 'hr@caregiverregistry.com', password: 'HR2024!' },
    manager: { email: 'manager@caregiverregistry.com', password: 'Manager456!' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check credentials
    const isValidCredential = Object.values(mockCredentials).some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (isValidCredential) {
      onLogin(formData);
    } else {
      setLoginAttempts(prev => prev + 1);
      setErrors({
        general: `Credenciales incorrectas. Usa: admin@caregiverregistry.com / Admin123! o hr@caregiverregistry.com / HR2024!`
      });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    const colors = ['bg-error', 'bg-warning', 'bg-accent', 'bg-success', 'bg-primary'];
    
    return { 
      strength, 
      label: labels[strength - 1] || '', 
      color: colors[strength - 1] || 'bg-muted' 
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error">Error de autenticación</p>
              <p className="text-sm text-error/80 mt-1">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Lockout Warning */}
      {loginAttempts >= 3 && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Advertencia de seguridad</p>
              <p className="text-sm text-warning/80 mt-1">
                Múltiples intentos fallidos. La cuenta se bloqueará tras 2 intentos más.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Field */}
      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="admin@caregiverregistry.com"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* Password Field */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            disabled={isLoading}
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary font-medium min-w-0">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Recordarme"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
          disabled={isLoading}
          size="sm"
        />
        
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          disabled={isLoading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading || loginAttempts >= 5}
        iconName="LogIn"
        iconPosition="left"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Two-Factor Authentication Prompt */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon name="Smartphone" size={20} className="text-text-secondary" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              Autenticación de dos factores disponible
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Configura 2FA para mayor seguridad en tu cuenta
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;