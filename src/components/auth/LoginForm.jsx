import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        // En registro, pasa los campos requeridos
        await login({ correo, password, nombre });
        setSuccessMsg('¡Cuenta registrada exitosamente! Redirigiendo...');
      } else {
        await login(correo, password);
        setSuccessMsg('¡Bienvenido de nuevo! Acceso verificado...');
      }

      setTimeout(() => {
        navigate('/reservas');
      }, 700);
    } catch (err) {
      setError(err.message || 'Error en las credenciales de acceso');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setCorreo('admin@bluevelvet.com');
      setPassword('admin123');
      setNombre('Staff Administrador');
    } else {
      setCorreo('cliente@bluevelvet.com');
      setPassword('cliente123');
      setNombre('Cliente Blue Velvet');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl velvet-glass border border-velvet-gold/30 shadow-2xl space-y-6">
      {/* Selector de Pestañas: Login vs Registro */}
      <div className="flex rounded-2xl bg-velvet-900/80 p-1 border border-white/10">
        <button
          type="button"
          onClick={() => {
            setIsRegister(false);
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            !isRegister
              ? 'bg-velvet-gold text-velvet-900 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegister(true);
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            isRegister
              ? 'bg-velvet-gold text-velvet-900 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-serif text-2xl font-bold text-white">
          {isRegister ? 'Únete al Club Blue Velvet' : 'Acceso a Clientes & Staff'}
        </h2>
        <p className="text-xs text-slate-300">
          {isRegister
            ? 'Disfruta de reservas prioritarias e invitaciones a catas privadas.'
            : 'Introduce tus credenciales para gestionar reservas y perfil con Bearer JWT.'}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Sofia García"
                className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-[1.01] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Verificando autenticación...</span>
          ) : (
            <>
              <span>{isRegister ? 'Completar Registro' : 'Acceder con Bearer JWT'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Relleno rápido para demostración académica DOSW */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <p className="text-[11px] text-center text-slate-400">
          Credenciales de demostración rápida (DOSW Sprint 2):
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('client')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 transition-colors"
          >
            Cliente VIP
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-velvet-gold transition-colors flex items-center justify-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Staff Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
