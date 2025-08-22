import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que precisam de autenticação
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

// Rotas públicas
const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  //   const path = request.nextUrl.pathname;
  //   const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  //   const isPublicRoute = publicRoutes.includes(path);
  //   // Verificar se há token de autenticação
  //   const token = request.cookies.get('authToken')?.value ||
  //                 request.headers.get('authorization')?.replace('Bearer ', '');
  //   // Se é uma rota protegida e não há token, redirecionar para login
  //   if (isProtectedRoute && !token) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  //   // Se está logado e tenta acessar login, redirecionar para dashboard
  //   if (isPublicRoute && token && path === '/login') {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  //   return NextResponse.next();
  // }
  // // Configurar matcher para aplicar middleware apenas em rotas específicas
  // export const config = {
  //   matcher: [
  //     '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  //   ],
}
