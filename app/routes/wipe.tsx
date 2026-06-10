import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            for (const file of files) {
                await fs.delete(file.path);
            }
            await kv.flush();
            await loadFiles();
            setShowConfirm(false);
        } catch (err) {
            console.error("Error deleting files:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center font-sans">
                <div className="w-full max-w-md bg-[#1a1a1a] border border-[#3c3c3c] p-12 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#3c3c3c] border-t-[#1c69d4] border-r-[#e22718] border-b-[#0066b1] rounded-full animate-spin mb-8"></div>
                    <h3 className="text-[16px] font-bold text-white uppercase tracking-[2px]">LOADING</h3>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center font-sans">
                <div className="w-full max-w-md bg-[#1a1a1a] border border-[#e22718] p-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#e22718]/10 border border-[#e22718] mb-6 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#e22718]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-[24px] font-bold text-white uppercase tracking-wide mb-2">SYSTEM ERROR</h2>
                    <p className="text-[14px] text-[#bbbbbb] font-light">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-black overflow-hidden font-sans">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(60, 60, 60, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(60, 60, 60, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Navigation */}
            <nav className="relative z-20 bg-black border-b border-[#3c3c3c] animate-fade-in">
                <div className="px-6 py-4 flex justify-between items-center max-w-[1200px] mx-auto">
                    <Link 
                        to="/" 
                        className="group flex items-center gap-3 px-6 py-3 border border-[#3c3c3c] bg-[#1a1a1a] transition-all duration-300 hover:border-white"
                    >
                        <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#7e7e7e] transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="text-white text-[12px] font-bold tracking-[1.5px] uppercase">BACK TO HOMEPAGE</span>
                    </Link>
                </div>
            </nav>

            {/* Main content */}
            <div className="relative z-10 min-h-[calc(100vh-80px)] p-6 pt-16">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Left Column: Title and Files */}
                    <div className="flex flex-col gap-8 animate-fade-in">
                        {/* Heading */}
                        <div>
                            <h1 className="text-[48px] font-black text-white uppercase tracking-tight leading-none mb-4">
                                DATA MANAGEMENT
                            </h1>
                            <div className="w-16 h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] mb-8"></div>
                            
                            {/* User info */}
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#1a1a1a] border border-[#3c3c3c]">
                                <div className="w-2 h-2 bg-[#0fa336]"></div>
                                <span className="text-[12px] text-[#7e7e7e] tracking-[1.5px] uppercase">AUTHENTICATED AS: </span>
                                <span className="text-[12px] text-white font-bold tracking-[1.5px] uppercase">{auth.user?.username}</span>
                            </div>
                        </div>

                        {/* Files section */}
                        <div className="bg-[#1a1a1a] border border-[#3c3c3c]">
                            <div className="p-6 border-b border-[#3c3c3c] bg-black flex items-center gap-4">
                                <div className="w-10 h-10 border border-[#3c3c3c] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-bold text-white uppercase tracking-wide">APPLICATION FILES</h2>
                                    <p className="text-[12px] text-[#7e7e7e] uppercase tracking-[1px]">MANAGE YOUR STORED DATA</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {files.length > 0 ? (
                                    <div className="space-y-4">
                                        {files.map((file) => (
                                            <div 
                                                key={file.id} 
                                                className="group flex items-center justify-between p-4 bg-[#0d0d0d] border border-[#262626] hover:border-white transition-colors duration-300"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 border border-[#3c3c3c] flex items-center justify-center bg-black transition-colors duration-300 group-hover:border-white">
                                                        <svg className="w-4 h-4 text-[#7e7e7e] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-white uppercase tracking-wide group-hover:text-white transition-colors duration-300">{file.name}</p>
                                                        <p className="text-[12px] text-[#7e7e7e]">{file.path}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 border border-[#3c3c3c] bg-black mx-auto mb-6 flex items-center justify-center opacity-50">
                                            <svg className="w-8 h-8 text-[#7e7e7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-[16px] font-bold text-[#7e7e7e] uppercase tracking-wide">NO FILES FOUND</p>
                                        <p className="text-[12px] text-[#555555] uppercase tracking-[1px] mt-2">YOUR APPLICATION DATA WILL APPEAR HERE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action section */}
                    <div className="animate-fade-in animation-delay-300">
                        <div className="relative bg-[#1a1a1a] border border-[#e22718]">
                            {/* Danger Accent Bar */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#e22718]"></div>

                            <div className="p-8 border-b border-[#3c3c3c] bg-black">
                                <div className="w-16 h-16 bg-[#e22718]/10 border border-[#e22718] mb-6 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[#e22718]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-[24px] font-bold text-white uppercase tracking-tight mb-4">WIPE APPLICATION DATA</h3>
                                <p className="text-[14px] text-[#bbbbbb] font-light leading-relaxed">
                                    THIS WILL PERMANENTLY DELETE ALL YOUR FILES AND CLEAR THE KEY-VALUE STORE. THIS ACTION CANNOT BE UNDONE.
                                </p>
                            </div>

                            <div className="p-8">
                                {!showConfirm ? (
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        disabled={files.length === 0}
                                        className="group w-full px-8 py-4 bg-[#e22718] text-white font-bold tracking-[2px] uppercase text-[14px] transition-all duration-300 hover:bg-[#c11c12] disabled:bg-[#3c3c3c] disabled:text-[#7e7e7e] disabled:cursor-not-allowed flex justify-center items-center gap-3"
                                    >
                                        <svg className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>{files.length === 0 ? 'NO DATA TO WIPE' : 'WIPE APP DATA'}</span>
                                    </button>
                                ) : (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="p-6 border border-[#e22718] bg-[#e22718]/10">
                                            <p className="text-[#e22718] font-bold uppercase tracking-[1.5px] mb-2 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                CONFIRMATION REQUIRED
                                            </p>
                                            <p className="text-[#bbbbbb] text-[12px] uppercase tracking-wide">ARE YOU SURE YOU WANT TO DELETE ALL YOUR DATA? THIS ACTION IS IRREVERSIBLE.</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={() => setShowConfirm(false)}
                                                className="flex-1 px-6 py-4 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-bold tracking-[1.5px] uppercase hover:bg-[#262626] transition-colors duration-300"
                                            >
                                                CANCEL
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="flex-1 px-6 py-4 bg-[#e22718] text-white font-bold tracking-[1.5px] uppercase hover:bg-[#c11c12] disabled:bg-[#3c3c3c] transition-colors duration-300 flex justify-center items-center"
                                            >
                                                {isDeleting ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>DELETING...</span>
                                                    </div>
                                                ) : (
                                                    'YES, DELETE EVERYTHING'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out both;
                }
                .animation-delay-300 { animation-delay: 0.3s; }
            `}</style>
        </main>
    );
};

export default WipeApp;