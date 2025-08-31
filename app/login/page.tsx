"use client";
import { useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InlineError from "@/components/ui/inline-error";
import { validateForm, signIn, type FormData, type FormErrors } from "@/services/authService";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function NetworkMonitoringLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (authError) setAuthError(null);
  };

  const handleSubmit = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      signIn(formData, setIsLoading, setAuthError, router);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Technical Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(90deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 82px, transparent 84px),
            linear-gradient(0deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 82px, transparent 84px)
          `,
            backgroundSize: "84px 84px",
          }}
        ></div>
      </div>

      {/* Floating Network Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl relative overflow-hidden">
          {/* Security indicator */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 text-xs text-emerald-400">
            <Shield className="w-3 h-3" />
            <span className="font-mono">SSL</span>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-6">
              {/* Header with System Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src="/infralogo.png"
                    width={300}
                    height={300}
                    alt=""
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Autenticação requerida para prosseguir
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === "email" ? "text-cyan-400" : "text-gray-500"
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white font-mono text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-400"
                      : focusedField === "email"
                        ? "border-cyan-500 focus:ring-cyan-500/20"
                        : "border-slate-600 hover:border-slate-500"
                  }`}
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-400 font-mono">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === "password"
                      ? "text-cyan-400"
                      : "text-gray-500"
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-900/50 border rounded-lg text-white font-mono text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-400"
                      : focusedField === "password"
                        ? "border-cyan-500 focus:ring-cyan-500/20"
                        : "border-slate-600 hover:border-slate-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-400 font-mono">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
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
         <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
              onVerify={(token) => setToken(token)}
              ref={captchaRef}
               languageOverride="pt"
            />
               {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3  font-mono text-sm font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  AUTENTICANDO...
                </div>
              ) : (
                "ACESSAR SISTEMA"
              )}
            </button>
          </div>
        </div>

        {/* System Footer */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-500 font-mono">
            <span>
              © 2024 InfraWatch | Direitos reservados por{" "}
              <Link href="https://rcsangola.co.ao/">rcsangola.co.ao</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}