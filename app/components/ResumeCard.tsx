import {Link} from "react-router"; 
import ScoreCircle from "~/components/ScoreCircle"; 
import {useEffect, useState} from "react"; 
import {usePuterStore} from "~/lib/puter";  

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {     
    const { fs } = usePuterStore();     
    const [resumeUrl, setResumeUrl] = useState('');      

    useEffect(() => {         
        const loadResume = async () => {             
            const blob = await fs.read(imagePath);             
            if(!blob) return;             
            let url = URL.createObjectURL(blob);             
            setResumeUrl(url);         
        }          

        loadResume();     
    }, [imagePath]);      

    return (         
        <Link to={`/resume/${id}`} className="resume-card-link animate-fade-in">
            <div className="resume-card">
                
                {/* M-Stripe Hover Accent */}
                <div className="resume-card__accent">
                    <div className="resume-card__accent-inner" />
                </div>

                {/* Header Section */}
                <div className="resume-card__header">
                    <div className="resume-card__header-content">
                        
                        {/* Company & Role */}
                        <div className="resume-card__info">
                            {companyName && (
                                <h2 className="resume-card__company">{companyName}</h2>
                            )}
                            
                            {jobTitle && (
                                <h3 className="resume-card__role">{jobTitle}</h3>
                            )}
                            
                            {!companyName && !jobTitle && (
                                <h2 className="resume-card__company">RESUME</h2>
                            )}

                            {/* Status Indicators */}
                            <div className="resume-card__status">
                                <div className="resume-card__status-item">
                                    <div className="resume-card__status-dot resume-card__status-dot--red" />
                                    <span>AI ANALYZED</span>
                                </div>
                                <div className="resume-card__status-sep" />
                                <div className="resume-card__status-item">
                                    <div className="resume-card__status-dot resume-card__status-dot--green" />
                                    <span>READY</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Score Circle */}
                        <div className="resume-card__score">
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                {resumeUrl && (
                    <div className="resume-card__image-sec">
                        <div className="resume-card__image-wrap">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="resume-card__img"
                            />
                            
                            {/* Hover Overlay */}
                            <div className="resume-card__overlay">
                                <div className="resume-card__cta">
                                    <span>VIEW ANALYSIS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="resume-card__footer">
                    <span className="resume-card__sys-id">SYS_ID: {id.split('-')[0]}</span>
                    <svg className="resume-card__footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>

            <style>{`
                .resume-card-link {
                    display: block;
                    position: relative;
                    text-decoration: none;
                }

                .resume-card {
                    position: relative;
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    overflow: hidden;
                    transition: all 0.5s ease;
                }

                .resume-card:hover {
                    border-color: #1c69d4;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                }

                /* ---- Hover Accent Top Border ---- */
                .resume-card__accent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: #262626;
                    transition: background 0.5s ease;
                    z-index: 10;
                }

                .resume-card:hover .resume-card__accent { background: #1c69d4; }

                .resume-card__accent-inner {
                    height: 100%;
                    width: 33.333%;
                    background: linear-gradient(90deg, #0066b1, #1c69d4, #e22718);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                .resume-card:hover .resume-card__accent-inner { opacity: 1; }

                /* ---- Header ---- */
                .resume-card__header {
                    position: relative;
                    padding: 24px;
                    border-bottom: 1px solid #3c3c3c;
                    background: #000;
                }

                .resume-card__header-content {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                }

                .resume-card__info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                    min-width: 0;
                }

                .resume-card__company {
                    font-size: 20px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: color 0.3s ease;
                }

                .resume-card:hover .resume-card__company { color: #1c69d4; }

                .resume-card__role {
                    font-size: 14px;
                    font-weight: 700;
                    color: #7e7e7e;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ---- Status Indicators ---- */
                .resume-card__status {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 16px;
                    opacity: 0.5;
                    transition: opacity 0.5s ease;
                }

                .resume-card:hover .resume-card__status { opacity: 1; }

                .resume-card__status-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                }

                .resume-card__status-dot { width: 6px; height: 6px; border-radius: 50%; }
                .resume-card__status-dot--red { background: #e22718; }
                .resume-card__status-dot--green { background: #0fa336; }

                .resume-card__status-sep { width: 1px; height: 12px; background: #3c3c3c; }

                /* ---- Score ---- */
                .resume-card__score {
                    flex-shrink: 0;
                    transition: transform 0.3s ease;
                }

                .resume-card:hover .resume-card__score { transform: scale(1.05); }

                /* ---- Image Section ---- */
                .resume-card__image-sec {
                    position: relative;
                    background: #000;
                    overflow: hidden;
                }

                .resume-card__image-wrap {
                    position: relative;
                    height: 300px;
                }

                @media (max-width: 640px) {
                    .resume-card__image-wrap { height: 200px; }
                }

                .resume-card__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top;
                    filter: grayscale(100%);
                    opacity: 0.8;
                    transition: all 0.7s ease;
                }

                .resume-card:hover .resume-card__img {
                    filter: grayscale(0%);
                    opacity: 1;
                }

                /* ---- Hover Overlay CTA ---- */
                .resume-card__overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    opacity: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.5s ease;
                    z-index: 20;
                }

                .resume-card:hover .resume-card__overlay { opacity: 1; }

                .resume-card__cta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #fff;
                    padding: 12px 24px;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    transform: translateY(16px);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .resume-card:hover .resume-card__cta { transform: translateY(0); }

                .resume-card__cta:hover {
                    background: #fff;
                    color: #000;
                }

                /* ---- Footer ---- */
                .resume-card__footer {
                    padding: 16px;
                    background: #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .resume-card__sys-id {
                    font-size: 10px;
                    font-weight: 700;
                    color: #7e7e7e;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .resume-card__footer-icon {
                    width: 16px;
                    height: 16px;
                    color: #7e7e7e;
                    transition: color 0.3s ease;
                }

                .resume-card:hover .resume-card__footer-icon { color: #fff; }

                /* ---- Animations ---- */
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out both;
                }
            `}</style>
        </Link>
    );
};

export default ResumeCard;