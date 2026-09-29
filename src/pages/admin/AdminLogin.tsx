import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth, DEFAULT_ADMIN_CREDENTIALS } from '../../lib/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [identifier, setIdentifier] = useState(DEFAULT_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(DEFAULT_ADMIN_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = auth.login(identifier, password);
      setLoading(false);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 350);
  };

  const handleFillDemoCredentials = () => {
    setIdentifier(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setError(null);
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080604] text-[#f4f4f5] flex flex-col justify-between selection:bg-orange-500 selection:text-black relative overflow-hidden font-sans">
      {/* Background cinematic aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/10 via-orange-700/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-6 flex items-center justify-between relative z-10">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="compact" />
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Protected Studio Access</span>
          </div>
        </div>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-[#111116]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 p-8 backdrop-blur-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-orange-500/10 border border-orange-600/20 text-orange-500 mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              Studio Admin Portal
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Sign in with your separate admin credentials to manage projects, inquiries, services & portfolio content.
            </p>
          </div>

          {/* Demo Quick-Fill Helper Callout */}
          <div className="bg-[#141008] border border-orange-600/25 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-orange-500 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Default Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[10px] text-orange-500 hover:text-orange-400 font-mono underline cursor-pointer"
              >
                {autoFilled ? 'Filled!' : 'Auto-Fill Demo'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300 bg-black/40 p-2 rounded border border-white/5">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Email / User</span>
                <span className="text-white truncate block">{DEFAULT_ADMIN_CREDENTIALS.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Password</span>
                <span className="text-orange-400 font-mono block">{DEFAULT_ADMIN_CREDENTIALS.password}</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-orange-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="admin@kaienvance.com or admin"
                  className="w-full bg-[#141008] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="w-full bg-[#141008] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-orange-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Note */}
          <div className="text-center pt-2 border-t border-white/5">
            <p className="text-[11px] text-zinc-500">
              Credentials can be updated anytime inside <span className="text-zinc-300">Security Settings</span>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] font-mono text-zinc-600 relative z-10">
        Kaien Vance Cinematic Video Studio &copy; {new Date().getFullYear()} &middot; Internal Administration
      </footer>
    </div>
  );
};
