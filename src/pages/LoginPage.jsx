import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    setValidationError('');
    setServerError('');

    if (!correo.trim()) {
      setValidationError('El correo electrónico es obligatorio.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setValidationError('Por favor ingresa un formato de correo electrónico válido.');
      return false;
    }

    if (!password) {
      setValidationError('La contraseña es obligatoria.');
      return false;
    }

    if (password.length < 4) {
      setValidationError('La contraseña debe contener al menos 4 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      await login(correo.trim(), password);
      setSuccess(true);
      // Redirección automática a '/menu' tras autenticación exitosa según requerimiento
      setTimeout(() => {
        navigate('/menu');
      }, 600);
    } catch (err) {
      console.warn('[LoginPage] Error al autenticar:', err);
      setServerError(
        err.message || 'Credenciales inválidas. Por favor verifica tu correo y contraseña.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role) => {
    setValidationError('');
    setServerError('');
    if (role === 'admin') {
      setCorreo('admin@bluevelvet.rest');
      setPassword('AdminPass2026!');
    } else {
      setCorreo('cliente.vip@gmail.com');
      setPassword('ClientePass2026!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-velvet-800 border border-velvet-gold/30 text-xs font-semibold text-velvet-gold">
            <Key className="w-3.5 h-3.5" />
            <span>Acceso Seguro Bearer JWT</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Portal Blue Velvet
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-light">
            Inicia sesión para gestionar tus reservas, consultar la carta exclusiva y personalizar tu
            experiencia gastronómica.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="p-8 rounded-3xl velvet-glass border border-velvet-gold/30 shadow-2xl space-y-6">
          {/* Alerta de Error de Validación o de Servidor */}
          {(validationError || serverError) && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError || serverError}</span>
            </div>
          )}

          {/* Notificación de Éxito */}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>¡Autenticación exitosa! Redirigiendo a la carta...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Campo Correo */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="ejemplo@bluevelvet.rest"
                  className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-velvet-gold transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium">
                  Contraseña
                </label>
                <span className="text-[11px] text-velvet-gold hover:underline cursor-pointer">
                  ¿Olvidaste tu clave?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="••••••••"
                  className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-velvet-gold transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Botón Submit con Estado de Carga */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a Blue Velvet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Autocompletado Rápido para Evaluadores DOSW */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <p className="text-[11px] text-center text-slate-400 font-medium">
              Acceso rápido para evaluación DOSW:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('client')}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-velvet-gold" />
                <span>Cliente VIP</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-velvet-gold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Badges de Seguridad */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-velvet-gold" />
            <span>Encriptación Bearer JWT</span>
          </div>
          <span className="text-slate-600">•</span>
          <span>Spring Boot 3 Security</span>
        </div>
      </div>
    </div>
  );
}
