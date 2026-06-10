import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [isHovering, setIsHovering] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
        setIsHovering(false);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB

    const {getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
        onDragEnter: () => setIsHovering(true),
        onDragLeave: () => setIsHovering(false),
    })

    const file = acceptedFiles[0] || null;
    const hasError = fileRejections.length > 0;

    let stateClass = '';
    if (isDragActive || isHovering) stateClass = 'uploader--active';
    else if (hasError) stateClass = 'uploader--error';
    else if (file) stateClass = 'uploader--success';

    return (
        <div className="w-full">
            <div className="uploader-container" {...getRootProps()}>
                <input {...getInputProps()} />
                
                <div className={`uploader-zone ${stateClass}`}>
                    {/* Corner bracket accents (M-Design signature) */}
                    <div className="uploader-bracket uploader-bracket--tl" />
                    <div className="uploader-bracket uploader-bracket--tr" />
                    <div className="uploader-bracket uploader-bracket--bl" />
                    <div className="uploader-bracket uploader-bracket--br" />

                    <div className="uploader-content">
                        {file ? (
                            // File selected state
                            <div className="uploader-state-file">
                                <div className="uploader-icon-box uploader-icon-box--success">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="uploader-filename">{file.name}</h3>
                                <p className="uploader-filesize">READY • {formatSize(file.size)}</p>
                            </div>
                        ) : (
                            // Upload state
                            <div className="uploader-state-empty">
                                <div className={`uploader-icon-box ${isDragActive ? 'uploader-icon-box--active' : ''}`}>
                                    <svg className={`uploader-icon ${isDragActive ? 'uploader-icon--bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className={`uploader-title ${isDragActive ? 'uploader-title--active' : ''}`}>
                                        {isDragActive ? 'DROP PDF HERE' : 'CLICK OR DRAG RESUME'}
                                    </p>
                                    <p className="uploader-desc">
                                        PDF FILES ONLY (MAX {formatSize(maxFileSize)})
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* Error state */}
                        {hasError && (
                            <div className="uploader-error">
                                <p className="uploader-error-title">UPLOAD ERROR</p>
                                <p className="uploader-error-desc">
                                    {fileRejections[0]?.errors[0]?.message || 'PLEASE CHECK YOUR FILE AND TRY AGAIN'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .uploader-container {
                    cursor: pointer;
                    width: 100%;
                }

                .uploader-zone {
                    position: relative;
                    padding: 48px 32px;
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    transition: all 0.3s ease;
                }

                .uploader-zone:hover {
                    border-color: #7e7e7e;
                }

                .uploader--active {
                    background: rgba(28, 105, 212, 0.1);
                    border-color: #1c69d4;
                }

                .uploader--error {
                    background: rgba(226, 39, 24, 0.1);
                    border-color: #e22718;
                }

                .uploader--success {
                    background: rgba(15, 163, 54, 0.1);
                    border-color: #0fa336;
                }

                /* Corner Brackets */
                .uploader-bracket {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-color: transparent;
                    transition: border-color 0.3s ease;
                }

                .uploader-zone:hover .uploader-bracket { border-color: #fff; }
                .uploader--active .uploader-bracket { border-color: #1c69d4; }
                .uploader--error .uploader-bracket { border-color: #e22718; }
                .uploader--success .uploader-bracket { border-color: #0fa336; }

                .uploader-bracket--tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
                .uploader-bracket--tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
                .uploader-bracket--bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
                .uploader-bracket--br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }

                /* Content */
                .uploader-content {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .uploader-icon-box {
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #3c3c3c;
                    background: #000;
                    margin: 0 auto 24px;
                    color: #fff;
                    transition: all 0.3s ease;
                }

                .uploader-zone:hover .uploader-icon-box { border-color: #fff; }
                .uploader-icon-box--active { border-color: #1c69d4; color: #1c69d4; }
                .uploader-icon-box--success { border-color: #0fa336; background: #0fa336; color: #fff; }

                .uploader-icon { width: 32px; height: 32px; transition: transform 0.3s ease; }
                .uploader-icon--bounce { animation: bounce 1s infinite; }

                .uploader-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    transition: color 0.3s ease;
                }

                .uploader-title--active { color: #1c69d4; }

                .uploader-desc {
                    font-size: 12px;
                    font-weight: 300;
                    color: #7e7e7e;
                    letter-spacing: 0.5px;
                }

                /* Success State */
                .uploader-filename {
                    font-size: 18px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 0 16px;
                }

                .uploader-filesize {
                    font-size: 12px;
                    font-weight: 700;
                    color: #0fa336;
                    letter-spacing: 1.5px;
                }

                /* Error State */
                .uploader-error {
                    margin-top: 24px;
                    padding: 12px 16px;
                    border: 1px solid #e22718;
                    background: rgba(226, 39, 24, 0.1);
                    text-align: left;
                    width: 100%;
                    max-width: 320px;
                }

                .uploader-error-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #e22718;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }

                .uploader-error-desc {
                    font-size: 12px;
                    font-weight: 300;
                    color: rgba(226, 39, 24, 0.8);
                    line-height: 1.4;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20%); }
                }
            `}</style>
        </div>
    )
}

export default FileUploader