import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(user.trim(), pass);
    setLoading(false);
    if (ok) {
      navigate('/admin/produtos', { replace: true });
    } else {
      setError('Usuário ou senha incorretos.');
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
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Usuário</label>
            <input
              className={inputCls}
              value={user}
              onChange={e => setUser(e.target.value)}
              autoComplete="username"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-navy transition-all mt-4 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <a href="/" className="block text-center mt-6 text-xs text-slate-400 hover:text-navy transition-colors">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}
