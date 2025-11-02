import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { UniteSolarLogo } from './UniteSolarLogo';
import { supabase } from '../services/supabaseClient';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';
import { FacebookIcon } from './icons/FacebookIcon';

const imageUrl = 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Redirect back to the app after successful login
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, the page will redirect, so no need to set loading to false.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
        });
        if (error) throw error;
        setMessage('Sign up successful! Please check your email for a confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The onAuthStateChange listener in App.tsx will handle successful login
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-solar-black text-foreground dark:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div 
          className="hidden lg:block bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-black bg-opacity-25"></div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="flex justify-start mb-8">
              <UniteSolarLogo className="h-16 w-auto" />
            </div>
            <h1 className="text-4xl font-bold font-display text-primary dark:text-solar-gold mb-4">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground dark:text-gray-400 mb-8 text-lg">
              {isSignUp ? 'Join us to access powerful solar insights.' : 'Sign in to manage your projects and reports.'}
            </p>
            
            <div className="space-y-4 mb-8">
              <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-border dark:border-gray-600 rounded-lg text-foreground dark:text-white hover:bg-secondary dark:hover:bg-charcoal-gray transition-colors font-medium disabled:opacity-50"
              >
                  <GoogleIcon className="w-6 h-6 mr-3" />
                  Sign in with Google
              </button>
              <button
                  onClick={() => handleSocialLogin('apple')}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center py-3 px-4 border bg-black text-white hover:bg-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                  <AppleIcon className="w-6 h-6 mr-3" />
                  Sign in with Apple
              </button>
              <button
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center py-3 px-4 border bg-[#1877F2] text-white hover:bg-[#166fe5] rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                  <FacebookIcon className="w-6 h-6 mr-3" />
                  Sign in with Facebook
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background dark:bg-solar-black text-muted-foreground dark:text-gray-400">
                      Or continue with email
                  </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                label="Email Address" 
                name="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
              <Input 
                label="Password" 
                name="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />

              {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
              {message && <p className="text-sm text-green-500 dark:text-green-400 text-center">{message}</p>}

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
              </div>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-sm text-primary dark:text-solar-gold hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};