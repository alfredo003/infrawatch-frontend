'use client';
import { useRef, useState, useCallback, memo } from 'react';
import { Eye, EyeOff, User, Lock, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InlineError from '@/components/ui/inline-error';
import {
  validateForm,
  signIn,
  type FormData,
  type FormErrors,
} from '@/services/authService';
import dynamic from 'next/dynamic';

const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), {
  ssr: false,
  loading: () => <div className="h-20 bg-slate-900/30 animate-pulse rounded" />,
});

// Componente de background otimizado e memoizado
const BackgroundPattern = memo(() => (
  <>
    {/* Technical Background Pattern */}
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

    {/* Floating Network Elements - Reduzido de 8 para 5 */}
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
          className={`w-full pl-10 ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 bg-slate-900/50 border text-white font-mono text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
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
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (authError) setAuthError(null);
    },
    [errors, authError],
  );

  const handleSubmit = useCallback(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      signIn(formData, setIsLoading, setAuthError, router);
    }
  }, [formData, router]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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
        {/* Login Card */}
        <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="text-center mb-6">
              {/* Header with System Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src="/infralogo.png"
                    width={300}
                    height={300}
                    alt="InfraWatch Logo"
                    priority
                    quality={90}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Autenticação requerida para prosseguir
              </p>
            </div>

            {/* Email Field */}
            <InputField
              id="email"
              type="email"
              value={formData.email}
              placeholder="email@exemplo.com"
              label="Email"
              error={errors.email}
              focused={focusedField === 'email'}
              icon={User}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('email', e.target.value)
              }
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Password Field */}
            <InputField
              id="password"
              type="password"
              value={formData.password}
              placeholder="••••••••"
              label="Senha"
              error={errors.password}
              focused={focusedField === 'password'}
              icon={Lock}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('password', e.target.value)
              }
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Security Notice */}
            <div className="bg-slate-900/50 border border-slate-700/50  p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-400 font-mono leading-relaxed">
                  <strong className="text-blue-400">SEGURANÇA:</strong> Esta
                  sessão será monitorada e registrada conforme políticas de
                  segurança.
                </div>
              </div>
            </div>

            {authError && <InlineError message={authError} />}
            {/* Recuperar Senha */}
            <div className="flex justify-end">
              <Link
                href="/recuperar-senha"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors duration-200 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
             <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
              onVerify={setToken}
              ref={captchaRef}
              languageOverride="pt"
            />
            
             {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 font-mono text-sm font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  AUTENTICANDO...
                </div>
              ) : (
                'ACESSAR SISTEMA'
              )}
            </button>
          </div>
        </div>

        {/* System Footer */}
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
