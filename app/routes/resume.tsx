import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'CV Wizard' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
        }

        loadResume();
    }, [id]);

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
                <div className="px-6 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
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
            <div className="relative z-10 flex flex-row w-full max-w-[1600px] mx-auto max-lg:flex-col-reverse">
                
                {/* Resume preview section */}
                <section className="w-[45%] max-lg:w-full h-[calc(100vh-80px)] sticky top-[80px] flex items-center justify-center p-8 animate-fade-in">
                    {imageUrl && resumeUrl && (
                        <div className="relative group w-full h-full max-h-[800px] flex flex-col">
                            
                            <div className="relative flex-1 bg-[#1a1a1a] border border-[#3c3c3c] transition-all duration-500 hover:border-white p-4 flex flex-col group/card">
                                
                                {/* Accent Bar */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

                                <div className="bg-black border border-[#262626] flex-1 overflow-hidden relative">
                                    <img
                                        src={imageUrl}
                                        className="w-full h-full object-contain filter grayscale opacity-90 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700"
                                        title="resume preview"
                                        alt="Resume preview"
                                    />
                                    
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <a 
                                            href={resumeUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 border border-white px-8 py-4 text-white text-[12px] font-bold tracking-[1.5px] uppercase transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300 hover:bg-white hover:text-black"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <span>OPEN PDF</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[10px] text-[#7e7e7e] tracking-[1.5px] uppercase">SYS_ID: {id?.split('-')[0]}</span>
                                    <span className="text-[10px] text-[#0fa336] tracking-[1.5px] uppercase font-bold">ANALYSIS COMPLETE</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Feedback section */}
                <section className="w-[55%] max-lg:w-full min-h-[calc(100vh-80px)] p-8">
                    <div className="max-w-3xl mx-auto w-full">
                        {/* Heading */}
                        <div className="mb-12 animate-fade-in">
                            <h1 className="text-[48px] font-black text-white uppercase tracking-tight leading-none mb-4">
                                RESUME REVIEW
                            </h1>
                            <div className="w-16 h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] mb-8"></div>
                            
                            {/* Status indicators */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#1c69d4]"></div>
                                    <span className="text-[10px] text-white font-bold tracking-[1.5px] uppercase">AI ANALYSIS</span>
                                </div>
                                <div className="w-[1px] h-3 bg-[#3c3c3c]"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#0fa336]"></div>
                                    <span className="text-[10px] text-white font-bold tracking-[1.5px] uppercase">ATS OPTIMIZED</span>
                                </div>
                                <div className="w-[1px] h-3 bg-[#3c3c3c]"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#e22718]"></div>
                                    <span className="text-[10px] text-white font-bold tracking-[1.5px] uppercase">DETAILED FEEDBACK</span>
                                </div>
                            </div>
                        </div>

                        {feedback ? (
                            <div className="flex flex-col gap-0 animate-fade-in animation-delay-300">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-32 animate-fade-in animation-delay-300">
                                <div className="w-full max-w-md bg-[#1a1a1a] border border-[#3c3c3c] p-12 flex flex-col items-center">
                                    {/* M-loader */}
                                    <div className="w-16 h-16 border-4 border-[#3c3c3c] border-t-[#1c69d4] border-r-[#e22718] border-b-[#0066b1] rounded-full animate-spin mb-8"></div>
                                    <h3 className="text-[16px] font-bold text-white uppercase tracking-[2px] mb-2">ANALYZING RESUME</h3>
                                    <p className="text-[12px] text-[#7e7e7e] uppercase tracking-[1px]">PLEASE WAIT WHILE THE ENGINE PROCESSES YOUR DATA.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
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
    )
}

export default Resume