import { usePuterStore } from "~/lib/puter";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import gsap from "gsap";

export const meta = () => [
    { title: "CV WIZARD — AUTHENTICATION" },
    { name: "description", content: "Log into your account" },
];

/* ------------------------------------------------------------------ */
/*  Reusable M-Stripe Divider                                         */
/* ------------------------------------------------------------------ */
function MStripe({ className = "" }: { className?: string }) {
    return (
        <div className={`flex w-full h-1 ${className}`}>
            <div className="flex-1 bg-[#0066b1]" />
            <div className="flex-1 bg-[#1c69d4]" />
            <div className="flex-1 bg-[#e22718]" />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Animated Grid Background (M-Design)                               */
/* ------------------------------------------------------------------ */
function GridBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            <div
                className="absolute inset-[-50%] w-[200%] h-[200%] opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                    transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
                    animation: "grid-move 20s linear infinite",
                    maskImage: "radial-gradient(ellipse at center, black 0%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 80%)",
                }}
            />
            {/* Subtle glow */}
            <div className="absolute top-[30%] left-[30%] w-[600px] h-[600px] bg-[#1c69d4] rounded-full blur-[150px] opacity-10 mix-blend-screen animate-pulse" />
        </div>
    );
}

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    // GSAP Refs
    const cardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next, navigate]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { y: 60, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
            );

            if (elementsRef.current) {
                gsap.fromTo(
                    elementsRef.current.children,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white font-['Inter']">
            <style>
                {`
                @keyframes grid-move {
                    0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
                    100% { transform: perspective(500px) rotateX(60deg) translateY(60px) translateZ(-200px); }
                }
                .loader-ring {
                    width: 24px;
                    height: 24px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                `}
            </style>

            <GridBackground />

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div
                    ref={cardRef}
                    className="bg-[#1a1a1a] border border-[#262626] relative overflow-hidden group/card shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Top M-Stripe Border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#262626] transition-colors duration-500">
                        <div className="h-full w-1/3 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] opacity-100" />
                    </div>

                    <div className="p-10 md:p-12" ref={elementsRef}>
                        <div className="text-center mb-10">
                            <span className="text-[#1c69d4] text-[11px] font-bold tracking-[2px] uppercase mb-4 block">
                                SECURE ACCESS
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
                                CV WIZARD
                            </h1>
                            <p className="text-[#7e7e7e] text-sm font-light">
                                Authenticate to continue your session
                            </p>
                        </div>

                        <div className="flex justify-center mb-10">
                            <div className="w-16 h-[1px] bg-[#3c3c3c]" />
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center justify-center gap-6 mb-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#0066b1] animate-pulse" />
                                <span className="text-[9px] font-bold tracking-widest text-[#7e7e7e]">SECURE</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#1c69d4] animate-pulse" style={{ animationDelay: '0.3s' }} />
                                <span className="text-[9px] font-bold tracking-widest text-[#7e7e7e]">FAST</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#e22718] animate-pulse" style={{ animationDelay: '0.6s' }} />
                                <span className="text-[9px] font-bold tracking-widest text-[#7e7e7e]">PRIVATE</span>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div>
                            {isLoading ? (
                                <button className="relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#2b2b2b] text-white font-bold text-[14px] tracking-[1.5px] uppercase cursor-not-allowed">
                                    <div className="loader-ring" />
                                    <span>AUTHENTICATING...</span>
                                </button>
                            ) : (
                                <>
                                    {auth.isAuthenticated ? (
                                        <button
                                            className="relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-transparent border border-[#e22718] text-[#e22718] font-bold text-[14px] tracking-[1.5px] uppercase transition-all duration-300 hover:bg-[rgba(226,39,24,0.1)] group/btn"
                                            onClick={auth.signOut}
                                        >
                                            <span className="relative z-10">TERMINATE SESSION</span>
                                            <svg className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            className="relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-white text-black font-bold text-[14px] tracking-[1.5px] uppercase transition-all duration-300 hover:bg-[#e6e6e6] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] group/btn overflow-hidden"
                                            onClick={auth.signIn}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_ease-out]" />
                                            <span className="relative z-10">INITIALIZE LOGIN</span>
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                `}
            </style>
        </main>
    );
};

export default Auth;