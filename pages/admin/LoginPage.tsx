import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../store/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMsg('');
    setLoading(true);
    const ok = await login(email.trim(), pass);
    setLoading(false);
    if (ok) {
      navigate('/admin/produtos', { replace: true });
    } else {
      setError('E-mail ou senha incorretos.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Digite o e-mail antes de redefinir a senha.');
      return;
    }
    setError('');
    setResetMsg('');
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetMsg(`Email de redefinição enviado para ${email.trim()}`);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada para esse e-mail.');
      } else {
        setError('Não foi possível enviar o email. Tente novamente.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all';

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-xl">R</div>
          <div>
            <h1 className="text-xl font-bold text-navy tracking-widest uppercase">Ótica Roland</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Painel Administrativo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">E-mail</label>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Senha</label>
            <input
              type="password"
              className={inputCls}
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          {resetMsg && <p className="text-emerald-600 text-sm font-medium">{resetMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all mt-4 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resetLoading}
            className="text-xs text-gold/50 hover:text-gold transition-colors disabled:opacity-40"
          >
            {resetLoading ? 'Enviando...' : 'Esqueci minha senha'}
          </button>
        </div>

        <a href="/" className="block text-center mt-4 text-xs text-slate-400 hover:text-navy transition-colors">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}
