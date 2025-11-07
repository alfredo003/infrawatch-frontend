'use client';
import { useState, useCallback, memo, useEffect } from 'react';
import { Eye, EyeOff, LogOut, KeyRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormDataRedifine, type FormErrors } from '@/services/authService';
import { useAuth } from '@/hooks/use-auth';
import { ResetPasswordUser } from '@/services/userService';

const BackgroundPattern = memo(() => (
  <>
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 82px, transparent 84px),
            linear-gradient(0deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 82px, transparent 84px)
          `,
          backgroundSize: '84px 84px',
        }}
      />
    </div>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"
          style={{
            left: `${10 + i * 18}%`,
            top: `${20 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  </>
));
BackgroundPattern.displayName = 'BackgroundPattern';

const InputField = memo(
  ({
    id,
    type,
    value,
    placeholder,
    label,
    error,
    focused,
    icon: Icon,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    onChange,
    onFocus,
    onBlur,
  }: any) => (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
            focused ? 'text-cyan-400' : 'text-gray-500'
          }`}
        />
        <input
          id={id}
          type={showPasswordToggle && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-10 ${
            showPasswordToggle ? 'pr-12' : 'pr-4'
          } py-3 bg-slate-900/50 border text-white font-mono text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-400'
              : focused
                ? 'border-cyan-500 focus:ring-cyan-500/20'
                : 'border-slate-600 hover:border-slate-500'
          }`}
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  ),
);
InputField.displayName = 'InputField';

export default function NetworkMonitoringLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataRedifine>({
    confirmPassword: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataRedifine, string | undefined>>
  >({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { signOut, user, isAuthenticated, isLoading } = useAuth();

  // simulação de status de usuário
  const [status, setStatus] = useState<'block' | 'registered'>('registered');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setStatus(user?.status == 'block' ? 'block' : 'registered');
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormDataRedifine, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (authError) setAuthError(null);
    },
    [errors, authError],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setAuthError('Usuário não identificado.');
      return;
    }

    if (formData.password === '123456789') {
      setAuthError('Coloque uma senha válida.');
      return;
    }

    if (formData.password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.confirmPassword !== formData.password) {
      setAuthError('As senhas não coincidem.');
      return;
    }

    const data = {
      user_id: user.id,
      new_password: formData.password,
    };

    try {
      await ResetPasswordUser(data);
      alert('Senha redefinida com sucesso!');
      signOut();
      router.push('/');
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/asset5.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <BackgroundPattern />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          {/* Status: BLOQUEADO */}
          {status === 'block' && (
            <div className="text-center space-y-6">
              <Image
                src="/infralogo.png"
                width={200}
                height={200}
                alt="InfraWatch Logo"
                className="mx-auto"
              />
              <h2 className="text-red-400 font-mono text-lg">
                Sua conta está bloqueada.
              </h2>
              <p className="text-gray-400 text-sm font-mono">
                Entre em contato com o administrador do sistema.
              </p>
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-mono text-sm flex items-center justify-center gap-2 transition"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4" /> Fazer Logout
              </button>
            </div>
          )}

          {/* Status: REGISTRED */}
          {status === 'registered' && (
            <div className="text-center space-y-6">
              <Image
                src="/infralogo.png"
                width={200}
                height={200}
                alt="InfraWatch Logo"
                className="mx-auto"
              />
              <h2 className="text-yellow-400 font-mono text-lg">
                Redefinir Senha
              </h2>
              <p className="text-gray-400 text-sm font-mono">
                Por favor, defina uma nova senha para continuar.
              </p>

              <form
                onSubmit={handleChangePassword}
                className="space-y-4 text-left"
              >
                <InputField
                  id="password"
                  type="password"
                  label="Nova Senha"
                  value={formData.password}
                  placeholder="Digite a nova senha"
                  icon={KeyRound}
                  error={errors.password}
                  focused={focusedField === 'password'}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={togglePasswordVisibility}
                  onChange={(e: any) =>
                    handleInputChange('password', e.target.value)
                  }
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />

                <InputField
                  id="confirmPassword"
                  type="password"
                  label="Confirmar Senha"
                  value={formData.confirmPassword || ''}
                  placeholder="Confirme a nova senha"
                  icon={KeyRound}
                  error={
                    formData.confirmPassword &&
                    formData.confirmPassword !== formData.password
                      ? 'As senhas não coincidem.'
                      : undefined
                  }
                  focused={focusedField === 'confirmPassword'}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={togglePasswordVisibility}
                  onChange={(e: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />

                {authError && (
                  <p className="text-red-400 text-xs font-mono">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 font-mono text-sm font-medium transition-all duration-200 shadow-lg transform hover:scale-105 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Atualizando...' : 'Redefinir Senha'}
                </button>
              </form>

              <button
                className="w-full text-white py-3 font-mono text-sm flex items-center justify-center gap-2 transition"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4" /> Fazer Logout
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-500 font-mono">
            <span>
              © 2024 InfraWatch | Direitos reservados por{' '}
              <Link
                href="https://rcsangola.co.ao/"
                className="hover:text-cyan-400 transition-colors"
              >
                rcsangola.co.ao
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
