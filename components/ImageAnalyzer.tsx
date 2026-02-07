import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import ResultCard from './ResultCard';
import Spinner from './Spinner';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';
import ConfidenceMeter from './ConfidenceMeter';

const API_BASE_URL = "http://localhost:9087";

const ImageAnalyzer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setAnalysisResult(null);
            setError(null);
        }
    };
    
    const handleAnalyze = useCallback(async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/analyze_disease_from_image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data: AnalysisResult = await response.json();
            setAnalysisResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze image. Please ensure the backend server is running and accessible.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile]);

    const handleDownload = () => {
        if (!analysisResult) return;
        const dataStr = JSON.stringify(analysisResult, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${analysisResult.predicted_class.replace(/\s+/g, '_')}_analysis.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    return (
        <div className="space-y-8">
            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Plant Image</h2>
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                    <div className="flex-1">
                        <label htmlFor="file-upload" className="group flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/30 hover:bg-white/40 hover:border-[var(--primary-accent)] transition-colors duration-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <div className="text-gray-400 group-hover:text-[var(--primary-accent)] transition-colors duration-300 transform group-hover:scale-110">
                                  <UploadIcon />
                                </div>
                                <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400">PNG, JPG, or JPEG</p>
                            </div>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                        </label>
                        {selectedFile && (
                             <div className="mt-4 text-sm text-gray-600">
                                Selected file: <span className="font-medium text-[var(--primary-accent)]">{selectedFile.name}</span>
                            </div>
                        )}
                    </div>
                     {previewUrl && (
                        <div className="mt-4 md:mt-0 md:w-1/3">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Image Preview:</p>
                            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg object-cover max-h-56 border border-[var(--border-color)]" />
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedFile || isLoading}
                        className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--tertiary-accent)] via-[var(--secondary-accent)] to-[var(--primary-accent)] bg-size-200 bg-pos-0 hover:bg-pos-100 rounded-lg shadow-lg disabled:hover:bg-pos-0 disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[var(--glow-color)] transform transition-all duration-300 ease-in-out glow-on-hover"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Disease'}
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center p-8 space-x-4">
                    <Spinner />
                    <p className="text-lg text-gray-600 animate-pulse">AI is analyzing the image...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-lg backdrop-blur-sm" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {analysisResult && (
                <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-6 border-b border-[var(--border-color)] pb-6">
                        <div className="text-center md:text-left flex-1">
                            <p className="text-sm font-medium text-[var(--primary-accent)]">Detected Disease</p>
                            <h3 className="text-3xl lg:text-4xl font-bold text-gradient capitalize">{analysisResult.predicted_class}</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-medium text-gray-500 mb-2">Confidence Score</p>
                            <ConfidenceMeter confidence={analysisResult.confidence} />
                        </div>
                        <div className="self-center md:self-start">
                             <button 
                                onClick={handleDownload}
                                className="inline-flex items-center px-4 py-2 bg-white/50 hover:bg-white/80 border border-[var(--border-color)] text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-colors">
                                <DownloadIcon />
                                <span className="ml-2">Download JSON</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="Symptoms" content={analysisResult.chatbot_answer.symptoms} />
                        <ResultCard title="Causes" content={analysisResult.chatbot_answer.causes} />
                        <ResultCard title="Prevention" content={analysisResult.chatbot_answer.prevention} />
                        <ResultCard title="Treatment" content={analysisResult.chatbot_answer.treatment} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzer;