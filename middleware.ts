import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
 
const TokenSchema = z.string().min(1, "Token inválido");

 
const protectedRoutes = [
  "/dashboard",
  "/servers",
  "/network",
  "/applications",
  "/systems",
  "/alerts",
  "/reports",
  "/operations",
  "/command-center",
  "/intelligence",
  "/agent-network",
];

 
const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // Verificar se há token de autenticação
  const token =
    request.cookies.get("authToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Validar token com Zod
  const tokenValidation = TokenSchema.safeParse(token);

  // Se é uma rota protegida e não há token válido, redirecionar para login
  if (isProtectedRoute && !tokenValidation.success) {
    console.warn(
      `Acesso não autorizado à rota protegida: ${path}. Erro: ${
        tokenValidation.error?.issues[0]?.message || "Token ausente"
      }`
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se está logado e tenta acessar login, redirecionar para dashboard
  if (isPublicRoute && tokenValidation.success && path === "/login") {
    console.log(`Usuário autenticado redirecionado de /login para /dashboard`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configurar matcher para aplicar middleware apenas em rotas específicas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};