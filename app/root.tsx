import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();

  useEffect(() => {
    init()
  }, [init]);

  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white antialiased overflow-x-hidden" suppressHydrationWarning={true}>
        <script src="https://js.puter.com/v2/"></script>
        
        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        
        <ScrollRestoration />
        <Scripts />

        {/* Global styles for consistent animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes gradient-rotate {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
          
          @keyframes gradient-rotate-reverse {
            0% { transform: rotate(360deg) scale(1.05); }
            50% { transform: rotate(180deg) scale(0.95); }
            100% { transform: rotate(0deg) scale(1.05); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-30px) translateX(15px) rotate(1deg); }
            50% { transform: translateY(-60px) translateX(-10px) rotate(-1deg); }
            75% { transform: translateY(-15px) translateX(-20px) rotate(0.5deg); }
          }
          
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(20px) translateX(-12px) rotate(-1deg); }
            50% { transform: translateY(40px) translateX(10px) rotate(1deg); }
            75% { transform: translateY(8px) translateX(15px) rotate(-0.5deg); }
          }
          
          @keyframes drift {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(30px) translateY(-20px); }
            50% { transform: translateX(-25px) translateY(-40px); }
            75% { transform: translateX(-40px) translateY(15px); }
          }
          
          @keyframes flow-up {
            0% { transform: translateY(120px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-120px); opacity: 0; }
          }
          
          @keyframes scale-in {
            0% { 
              opacity: 0; 
              transform: scale(0.8) translateY(40px); 
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0px); 
            }
          }
          
          @keyframes slide-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-down {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-left {
            0% { opacity: 0; transform: translateX(30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slide-right {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes fade-in-scale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes expand-contract {
            0%, 100% { width: 24px; opacity: 0.8; }
            50% { width: 48px; opacity: 1; }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              opacity: 0.4; 
              box-shadow: 0 0 5px currentColor; 
            }
            50% { 
              opacity: 1; 
              box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; 
            }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes ping-slow {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          
          @keyframes pulse-button {
            0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 194, 0.3); }
            50% { box-shadow: 0 0 40px rgba(34, 197, 194, 0.6), 0 0 60px rgba(34, 197, 194, 0.3); }
          }

          @keyframes rotate-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes wiggle {
            0%, 7%, 100% { transform: rotate(-3deg); }
            3.5% { transform: rotate(3deg); }
          }

          @keyframes heartbeat {
            0%, 50%, 100% { transform: scale(1); }
            25%, 75% { transform: scale(1.1); }
          }
          
          /* Animation classes */
          .animate-gradient-flow {
            animation: gradient-flow 4s ease-in-out infinite;
          }
          
          .animate-gradient-rotate {
            animation: gradient-rotate 8s linear infinite;
          }
          
          .animate-gradient-rotate-reverse {
            animation: gradient-rotate-reverse 12s linear infinite;
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-float-reverse {
            animation: float-reverse 10s ease-in-out infinite;
          }
          
          .animate-drift {
            animation: drift 12s ease-in-out infinite;
          }
          
          .animate-flow-up {
            animation: flow-up 5s linear infinite;
          }
          
          .animate-scale-in {
            animation: scale-in 1s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out both;
          }

          .animate-slide-down {
            animation: slide-down 0.8s ease-out both;
          }

          .animate-slide-left {
            animation: slide-left 0.8s ease-out both;
          }

          .animate-slide-right {
            animation: slide-right 0.8s ease-out both;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out both;
          }

          .animate-fade-in-scale {
            animation: fade-in-scale 0.8s ease-out both;
          }
          
          .animate-expand-contract {
            animation: expand-contract 2s ease-in-out infinite;
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          
          .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .animate-pulse-button {
            animation: pulse-button 2s ease-in-out infinite;
          }

          .animate-rotate-slow {
            animation: rotate-slow 20s linear infinite;
          }

          .animate-wiggle {
            animation: wiggle 1s ease-in-out infinite;
          }

          .animate-heartbeat {
            animation: heartbeat 2s ease-in-out infinite;
          }
          
          /* Animation delays */
          .animation-delay-75 { animation-delay: 0.075s; }
          .animation-delay-100 { animation-delay: 0.1s; }
          .animation-delay-150 { animation-delay: 0.15s; }
          .animation-delay-200 { animation-delay: 0.2s; }
          .animation-delay-300 { animation-delay: 0.3s; }
          .animation-delay-500 { animation-delay: 0.5s; }
          .animation-delay-600 { animation-delay: 0.6s; }
          .animation-delay-700 { animation-delay: 0.7s; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-1200 { animation-delay: 1.2s; }
          .animation-delay-1500 { animation-delay: 1.5s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }

          /* Custom scrollbar — M tricolor inspired */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: #000;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #0066b1, #1c69d4, #e22718);
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #0077cc, #2080f0, #ff3322);
          }

          /* Focus styles */
          *:focus {
            outline: 2px solid rgba(28, 105, 212, 0.5);
            outline-offset: 2px;
          }

          /* Reduced motion */
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        ` }} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      {/* Error card with glass morphism */}
      <div className="relative group animate-scale-in">
        {/* Gradient border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 rounded-3xl opacity-75 blur-lg animate-gradient-rotate"></div>
        
        <section className="relative backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
          <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
            <div className="text-center space-y-6">
              {/* Error icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Error message */}
              <div className="space-y-4">
                <h1 className="text-4xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-flow bg-[length:300%_100%]">
                  {message}
                </h1>
                <p className="text-xl text-gray-300 font-medium">
                  {details}
                </p>
              </div>

              {/* Stack trace in development */}
              {stack && (
                <div className="text-left animate-fade-in animation-delay-500">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 max-h-64 overflow-auto">
                    <pre className="text-sm text-gray-400 font-mono">
                      <code>{stack}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Action button */}
              <div className="pt-4 animate-slide-up animation-delay-700">
                <button 
                  onClick={() => window.location.reload()}
                  className="group relative px-8 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-violet-400 rounded-xl font-bold text-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out skew-x-12"></div>
                  <div className="relative flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reload Page
                  </div>
                </button>
              </div>

              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-6 opacity-50 animate-fade-in animation-delay-1000">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-glow"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse-glow animation-delay-300"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse-glow animation-delay-600"></div>
                </div>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}