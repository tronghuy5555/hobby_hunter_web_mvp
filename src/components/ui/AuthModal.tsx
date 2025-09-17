import React, { useState } from 'react';
import { Modal } from '../ui';
import { LoginForm, RegisterForm } from '../forms';
import { useAppStore } from '../../store';
import type { LoginCredentials } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, isLoading } = useAppStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
    onClose();
  };

  const handleRegister = async (data: { username: string; email: string; password: string }) => {
    // For now, we'll just simulate registration by logging in
    // In a real app, this would call a register API endpoint
    console.log('Registration data:', data);
    
    // Simulate successful registration by auto-logging in
    await login({
      email: data.email,
      password: data.password,
    });
    onClose();
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
      className="max-w-md"
    >
      <div className="p-6">
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={switchToRegister}
            loading={isLoading === 'loading'}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onSwitchToLogin={switchToLogin}
            loading={isLoading === 'loading'}
          />
        )}
      </div>
    </Modal>
  );
};