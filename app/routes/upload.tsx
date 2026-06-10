import { type FormEvent, useState, useEffect, useRef } from 'react'
import gsap from "gsap";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => ([
    { title: 'CV WIZARD — UPLOAD RESUME' },
    { name: 'upload', content: 'Upload your resume for AI analysis' },
])

/* ------------------------------------------------------------------ */
/*  Reusable M-Stripe Divider                                         */
/* ------------------------------------------------------------------ */
function MStripe({ className = "" }: { className?: string }) {
    return (
        <div className={`m-stripe-upload ${className}`}>
            <div className="m-stripe-upload__s1" />
            <div className="m-stripe-upload__s2" />
            <div className="m-stripe-upload__s3" />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Particle field (subtle)                                            */
/* ------------------------------------------------------------------ */
function UploadParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
        const colors = ["#0066b1", "#1c69d4", "#e22718", "#3c3c3c"];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 2;
        };

        const init = () => {
            const count = Math.min(40, Math.floor(window.innerWidth / 40));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.3 + 0.05,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(draw);
        };

        resize();
        init();
        draw();
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="upload-particles" aria-hidden="true" />;
}

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Refs for GSAP
    const formCardRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stripeRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
    const processingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            // Stripe reveal
            if (stripeRef.current) {
                tl.fromTo(stripeRef.current,
                    { scaleX: 0, transformOrigin: "left center" },
                    { scaleX: 1, duration: 1 },
                    0
                );
            }

            // Badge entrance
            if (badgeRef.current) {
                tl.fromTo(badgeRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 },
                    0.3
                );
            }

            // Headline entrance
            if (headlineRef.current) {
                tl.fromTo(headlineRef.current,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9 },
                    0.4
                );
            }

            // Sub text
            if (subRef.current) {
                tl.fromTo(subRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7 },
                    0.7
                );
            }

            // Form card
            if (formCardRef.current) {
                tl.fromTo(formCardRef.current,
                    { y: 80, opacity: 0, scale: 0.97 },
                    { y: 0, opacity: 1, scale: 1, duration: 1 },
                    0.9
                );

                // Stagger children inside the form
                const fields = formCardRef.current.querySelectorAll('.upload-field');
                if (fields.length) {
                    tl.fromTo(fields,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
                        1.1
                    );
                }
            }

            // Steps
            if (stepsRef.current) {
                const steps = stepsRef.current.querySelectorAll('.upload-step');
                tl.fromTo(steps,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
                    1.4
                );
            }
        });
        return () => ctx.revert();
    }, []);

    // Processing animation
    useEffect(() => {
        if (isProcessing && processingRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(processingRef.current,
                    { opacity: 0, scale: 0.95 },
                    { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
                );
            });
            return () => ctx.revert();
        }
    }, [isProcessing]);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        try {
            setStatusText('UPLOADING SECURELY...');
            const uploadRes = await fs.upload([file]);
            const uploadedFile = Array.isArray(uploadRes) ? uploadRes[0] : uploadRes;
            if(!uploadedFile || !uploadedFile.path) {
                setStatusText('ERROR: UPLOAD FAILED');
                return;
            }

            setStatusText('PROCESSING FORMAT...');
            const { convertPdfToImage } = await import("~/lib/pdf2img");
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                setStatusText('ERROR: FORMAT CONVERSION FAILED');
                return;
            }

            setStatusText('EXTRACTING DATA...');
            const uploadImgRes = await fs.upload([imageFile.file]);
            const uploadedImage = Array.isArray(uploadImgRes) ? uploadImgRes[0] : uploadImgRes;
            if(!uploadedImage || !uploadedImage.path) {
                setStatusText('ERROR: EXTRACTION FAILED');
                return;
            }

            setStatusText('INITIALIZING AI ENGINE...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('ANALYZING RESUME AGAINST ATS...');

            let feedback;
            try {
                feedback = await ai.feedback(
                    uploadedImage.path,
                    prepareInstructions({ jobTitle, jobDescription })
                );
            } catch (aiErr: any) {
                console.error("AI Feedback Error:", aiErr);
                setStatusText(`ERROR: AI ENGINE FAILED (${aiErr?.message || 'Check Console'})`);
                return;
            }
            
            if (!feedback || !feedback.message || !feedback.message.content) {
                setStatusText('ERROR: INVALID ANALYSIS RESPONSE');
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            
            setStatusText('ANALYSIS COMPLETE. REDIRECTING...');
            
            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 1000);
        } catch (error: any) {
            console.error("Pipeline Error:", error);
            setStatusText(`ERROR: ${error?.message || 'UNKNOWN PIPELINE ERROR'}`);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="upload-page">
            <UploadParticles />
            <Navbar />

            <div className="upload-page__container">
                {/* ===== HERO HEADER ===== */}
                <header className="upload-hero" ref={headerRef}>
                    <div ref={stripeRef}>
                        <MStripe className="upload-hero__stripe" />
                    </div>

                    <div className="upload-hero__badge" ref={badgeRef}>
                        <span className="upload-hero__badge-dot" />
                        <span className="upload-hero__badge-text">ANALYSIS ENGINE V2.0</span>
                    </div>

                    <h1 className="upload-hero__headline" ref={headlineRef}>
                        TARGET YOUR<br />
                        <span className="upload-hero__accent">DREAM JOB</span>
                    </h1>

                    <p className="upload-hero__sub" ref={subRef}>
                        Provide the details of your target role and upload your resume.
                        Our AI engine will run a comprehensive ATS and impact analysis.
                    </p>
                </header>

                {isProcessing ? (
                    /* ===== PROCESSING STATE ===== */
                    <div className="upload-processing" ref={processingRef}>
                        <div className="upload-processing__card">
                            <MStripe />
                            <div className="upload-processing__inner">
                                <div className="upload-processing__ring">
                                    <div className="upload-processing__ring-inner" />
                                </div>
                                
                                <h2 className="upload-processing__status">{statusText}</h2>
                                
                                <div className="upload-processing__indicators">
                                    <div className="upload-processing__indicator">
                                        <div className="upload-processing__dot upload-processing__dot--blue" />
                                        <span>FORMAT</span>
                                    </div>
                                    <div className="upload-processing__sep" />
                                    <div className="upload-processing__indicator">
                                        <div className="upload-processing__dot upload-processing__dot--red" />
                                        <span>IMPACT</span>
                                    </div>
                                    <div className="upload-processing__sep" />
                                    <div className="upload-processing__indicator">
                                        <div className="upload-processing__dot upload-processing__dot--white" />
                                        <span>ATS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ===== FORM CARD ===== */
                    <div className="upload-card" ref={formCardRef}>
                        <MStripe />
                        <form id="upload-form" onSubmit={handleSubmit} className="upload-form">
                            
                            {/* Row 1: Company + Role */}
                            <div className="upload-form__row-2col">
                                <div className="upload-field">
                                    <label htmlFor="company-name" className="upload-field__label">
                                        TARGET COMPANY
                                    </label>
                                    <input 
                                        type="text" 
                                        name="company-name" 
                                        placeholder="e.g. BMW Group" 
                                        id="company-name"
                                        className="upload-field__input"
                                        required
                                    />
                                </div>
                                <div className="upload-field">
                                    <label htmlFor="job-title" className="upload-field__label">
                                        TARGET ROLE / TITLE
                                    </label>
                                    <input 
                                        type="text"
                                        name="job-title" 
                                        placeholder="e.g. Senior Frontend Engineer" 
                                        id="job-title"
                                        className="upload-field__input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2: Job Description */}
                            <div className="upload-field">
                                <label htmlFor="job-description" className="upload-field__label upload-field__label--row">
                                    <span>JOB DESCRIPTION</span>
                                    <span className="upload-field__hint">PASTE FULL DESCRIPTION FOR BEST ATS MATCH</span>
                                </label>
                                <textarea 
                                    rows={6} 
                                    name="job-description" 
                                    placeholder="Paste the requirements, responsibilities, and qualifications here..." 
                                    id="job-description"
                                    className="upload-field__input upload-field__textarea"
                                    required
                                />
                            </div>

                            {/* Row 3: File Upload */}
                            <div className="upload-field">
                                <label className="upload-field__label">
                                    RESUME DOCUMENT (PDF)
                                </label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            {/* Divider */}
                            <div className="upload-form__divider" />

                            {/* Submit */}
                            <div className="upload-form__submit-wrap">
                                <button 
                                    className="upload-submit-btn"
                                    type="submit"
                                    disabled={!file}
                                >
                                    <span>INITIATE ANALYSIS</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ===== STEPS (Below Form) ===== */}
                {!isProcessing && (
                    <div className="upload-steps" ref={stepsRef}>
                        {[
                            { num: "01", title: "CONFIGURE", desc: "Define your target role and company." },
                            { num: "02", title: "UPLOAD", desc: "Drop your PDF resume into the engine." },
                            { num: "03", title: "ANALYZE", desc: "AI scans every metric and keyword." },
                        ].map((step, i) => (
                            <div key={i} className="upload-step">
                                <span className="upload-step__num">{step.num}</span>
                                <h4 className="upload-step__title">{step.title}</h4>
                                <p className="upload-step__desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                /* ============================================ */
                /*  UPLOAD PAGE — AWWWARDS-LEVEL M-DESIGN       */
                /* ============================================ */

                .upload-page {
                    position: relative;
                    min-height: 100vh;
                    background-color: #000;
                    color: #fff;
                    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow-x: hidden;
                }

                .upload-particles {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                }

                .upload-page__container {
                    position: relative;
                    z-index: 10;
                    max-width: 780px;
                    margin: 0 auto;
                    padding: 140px 24px 96px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                /* ---- M-STRIPE ---- */
                .m-stripe-upload { display: flex; width: 100%; height: 4px; }
                .m-stripe-upload__s1 { flex: 1; background: #0066b1; }
                .m-stripe-upload__s2 { flex: 1; background: #1c69d4; }
                .m-stripe-upload__s3 { flex: 1; background: #e22718; }

                /* ---- HERO HEADER ---- */
                .upload-hero {
                    text-align: center;
                    margin-bottom: 64px;
                    width: 100%;
                }

                .upload-hero__stripe {
                    max-width: 200px;
                    margin: 0 auto 32px;
                }

                .upload-hero__badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border: 1px solid #3c3c3c;
                    margin-bottom: 24px;
                }

                .upload-hero__badge-dot {
                    width: 6px;
                    height: 6px;
                    background: #0fa336;
                    border-radius: 50%;
                    animation: dot-pulse 2s ease-in-out infinite;
                }

                .upload-hero__badge-text {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #7e7e7e;
                }

                .upload-hero__headline {
                    font-size: clamp(40px, 6vw, 64px);
                    font-weight: 700;
                    line-height: 1;
                    letter-spacing: -1px;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                }

                .upload-hero__accent {
                    color: #e22718;
                }

                .upload-hero__sub {
                    font-size: 16px;
                    font-weight: 300;
                    color: #bbbbbb;
                    line-height: 1.6;
                    max-width: 480px;
                    margin: 0 auto;
                }

                /* ---- FORM CARD ---- */
                .upload-card {
                    width: 100%;
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    overflow: hidden;
                    transition: border-color 0.5s ease;
                }

                .upload-card:hover {
                    border-color: #555;
                }

                .upload-form {
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                @media (max-width: 640px) {
                    .upload-form { padding: 24px; gap: 24px; }
                }

                /* ---- 2-COL ROW ---- */
                .upload-form__row-2col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                @media (max-width: 640px) {
                    .upload-form__row-2col { grid-template-columns: 1fr; }
                }

                /* ---- FIELD ---- */
                .upload-field {
                    display: flex;
                    flex-direction: column;
                }

                .upload-field__label {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #7e7e7e;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                    transition: color 0.3s ease;
                }

                .upload-field__label--row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .upload-field__hint {
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 0.5px;
                    color: #555;
                }

                .upload-field:focus-within .upload-field__label {
                    color: #fff;
                }

                .upload-field__input {
                    width: 100%;
                    padding: 14px 16px;
                    background: #0d0d0d;
                    border: 1px solid #3c3c3c;
                    border-radius: 0;
                    color: #fff;
                    font-family: "Inter", sans-serif;
                    font-size: 15px;
                    font-weight: 300;
                    line-height: 1.5;
                    transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
                    box-sizing: border-box;
                }

                .upload-field__input::placeholder {
                    color: #555;
                    font-weight: 300;
                }

                .upload-field__input:focus {
                    outline: none;
                    border-color: #1c69d4;
                    background: #1a1a1a;
                    box-shadow: 0 0 0 1px rgba(28, 105, 212, 0.3);
                }

                .upload-field__textarea {
                    resize: vertical;
                    min-height: 150px;
                }

                /* ---- DIVIDER ---- */
                .upload-form__divider {
                    height: 1px;
                    background: #262626;
                }

                /* ---- SUBMIT ---- */
                .upload-form__submit-wrap {
                    display: flex;
                    justify-content: center;
                }

                .upload-submit-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 48px;
                    background: #fff;
                    color: #000;
                    font-family: "Inter", sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 0;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }

                .upload-submit-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }

                .upload-submit-btn:hover:not(:disabled)::before {
                    transform: translateX(100%);
                }

                .upload-submit-btn:hover:not(:disabled) {
                    background: #e6e6e6;
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.1);
                }

                .upload-submit-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .upload-submit-btn svg {
                    transition: transform 0.3s ease;
                }

                .upload-submit-btn:hover:not(:disabled) svg {
                    transform: translateX(4px);
                }

                /* ---- STEPS (Below form) ---- */
                .upload-steps {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    width: 100%;
                    margin-top: 64px;
                }

                @media (max-width: 640px) {
                    .upload-steps { grid-template-columns: 1fr; gap: 16px; }
                }

                .upload-step {
                    text-align: center;
                    padding: 32px 16px;
                    border: 1px solid #262626;
                    background: #0d0d0d;
                    transition: border-color 0.3s ease, transform 0.3s ease;
                }

                .upload-step:hover {
                    border-color: #3c3c3c;
                    transform: translateY(-4px);
                }

                .upload-step__num {
                    display: block;
                    font-size: 32px;
                    font-weight: 700;
                    color: #262626;
                    margin-bottom: 12px;
                    letter-spacing: -1px;
                    transition: color 0.3s ease;
                }

                .upload-step:hover .upload-step__num {
                    color: #1c69d4;
                }

                .upload-step__title {
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #fff;
                    margin-bottom: 8px;
                }

                .upload-step__desc {
                    font-size: 13px;
                    font-weight: 300;
                    color: #7e7e7e;
                    line-height: 1.5;
                }

                /* ---- PROCESSING ---- */
                .upload-processing {
                    width: 100%;
                }

                .upload-processing__card {
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    overflow: hidden;
                }

                .upload-processing__inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 40px;
                }

                .upload-processing__ring {
                    width: 80px;
                    height: 80px;
                    border: 2px solid #262626;
                    border-top-color: #1c69d4;
                    border-right-color: #e22718;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 40px;
                }

                .upload-processing__ring-inner {
                    width: 48px;
                    height: 48px;
                    border: 2px solid #262626;
                    border-bottom-color: #0066b1;
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite reverse;
                }

                .upload-processing__status {
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    text-align: center;
                    margin-bottom: 40px;
                    color: #e6e6e6;
                }

                .upload-processing__indicators {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .upload-processing__indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #7e7e7e;
                }

                .upload-processing__dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: dot-pulse 1.5s ease-in-out infinite;
                }

                .upload-processing__dot--blue { background: #1c69d4; }
                .upload-processing__dot--red { background: #e22718; animation-delay: 0.3s; }
                .upload-processing__dot--white { background: #fff; animation-delay: 0.6s; }

                .upload-processing__sep {
                    width: 1px;
                    height: 24px;
                    background: #3c3c3c;
                }

                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes dot-pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.4); }
                }
            `}</style>
        </main>
    )
}

export default Upload