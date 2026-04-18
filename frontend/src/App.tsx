import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle2, ArrowRight, Loader2, Trash2, BarChart3, Clock, Activity } from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
  is_anomaly: boolean;
  anomaly_score: number;
  verdict: string;
}

export default function App() {
  const [reviewText, setReviewText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>(['System Ready', 'Awaiting Analysis']);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev.slice(-4), `[${timestamp}] ${message}`]);
  };

  const handleAnalyze = async () => {
    if (!reviewText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    addLog('Analyzing neural patterns...');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/analyze', {
        review_text: reviewText,
      });

      const data: AnalysisResult = response.data;
      setResult(data);
      addLog(`Analysis complete. Anomaly: ${data.is_anomaly}`);
    } catch (error) {
      console.error('API Error:', error);
      addLog('Backend offline. Check FastAPI server.');
      setTimeout(() => {
        const mockScore = 0.9924;
        setResult({
          is_anomaly: true,
          anomaly_score: mockScore,
          verdict: 'Suspicious (Commercial Payload Detected)',
        });
        addLog('Simulation Mode Active.');
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setReviewText('');
    setResult(null);
    setLogs(['System Ready', 'Awaiting Analysis']);
    addLog('Workspace cleared.');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleAnalyze();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        if (reviewText) {
          navigator.clipboard.writeText(reviewText);
          setShowCopyToast(true);
          setTimeout(() => setShowCopyToast(false), 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviewText, isAnalyzing]);

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex flex-col selection:bg-accent/10 selection:text-accent">

      <nav className="bg-white/80 backdrop-blur-md border-b border-border px-8 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary">Sentinel</h1>
              <p className="micro-label opacity-60 font-bold uppercase tracking-widest text-[10px]">Neural Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-8 text-sm font-semibold text-text-muted">
              <a href="#" className="text-primary font-bold">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6">

        <div className="md:col-span-8 md:row-span-1 flex flex-col justify-center py-4 md:py-0">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-1">
            Verify <span className="font-serif italic font-normal text-accent">authenticity</span> in seconds.
          </h2>
          <p className="text-text-muted text-xs sm:text-sm font-medium">Advanced neural pattern recognition for modern content verification.</p>
        </div>

        <div className="md:col-span-4 md:row-span-1 bento-card p-6 flex items-center justify-between bg-accent/5 border-accent/10 rounded-3xl border shadow-sm">
          <div>
            <p className="micro-label text-accent font-bold uppercase tracking-widest text-[10px]">System Status</p>
            <p className="text-lg font-bold text-primary">Core Operational</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-accent animate-pulse" />
          </div>
        </div>

        <div className="md:col-span-8 md:row-span-5 bento-card flex flex-col overflow-hidden bg-white border border-border rounded-3xl shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <p className="micro-label font-bold uppercase tracking-widest text-[10px]">Neural Input Buffer</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                <span>Syncing...</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8 relative">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste the review text here for deep neural analysis..."
              className="w-full h-full bg-transparent border-none outline-none resize-none text-lg md:text-xl leading-relaxed placeholder:text-slate-300 font-medium min-h-[200px] md:min-h-0"
            />
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <kbd className="px-1.5 py-0.5 bg-white border border-border rounded shadow-sm font-sans">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-border rounded shadow-sm font-sans">Enter</kbd>
                <span>to Verify</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="px-4 py-2 rounded-xl text-sm font-bold text-text-muted hover:bg-slate-100 transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !reviewText.trim()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isAnalyzing ? 'Analyzing...' : 'Verify Review'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 md:row-span-3 bento-card flex flex-col bg-white border border-border rounded-3xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-border bg-slate-50/50">
            <p className="micro-label font-bold uppercase tracking-widest text-[10px]">Analysis Result</p>
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg ${result.is_anomaly ? 'bg-red-500 shadow-red-200 text-white' : 'bg-emerald-500 shadow-emerald-200 text-white'
                    }`}>
                    {result.is_anomaly ? <AlertCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                  </div>

                  <div className="mb-8">
                    <p className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block ${result.is_anomaly ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      {result.verdict}
                    </p>
                    <h3 className="text-4xl font-black text-primary tracking-tight">{result.anomaly_score.toFixed(4)}</h3>
                    <p className="micro-label font-bold uppercase tracking-widest text-[10px] mt-1 text-text-muted">Anomaly Score</p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      <span>Confidence</span>
                      <span className="text-primary">{(Math.abs(result.anomaly_score) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.abs(result.anomaly_score) * 100}%` }}
                        className={`h-full ${result.is_anomaly ? 'bg-red-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center opacity-30">
                  <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-sm font-medium text-text-muted max-w-[200px]">Run analysis to view detailed metrics and insights.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="md:col-span-4 md:row-span-2 bento-card p-6 flex flex-col bg-[#0F172A] rounded-3xl shadow-xl">
          <p className="micro-label mb-4 text-sky-400 font-bold uppercase tracking-widest text-[10px]">System Activity</p>
          <div className="flex-1 space-y-2 overflow-y-auto pr-2 font-mono">
            {logs.map((log, i) => (
              <div key={i} className="text-slate-400 border-l border-slate-800 pl-3 py-0.5 text-[10px]">
                <span className="text-sky-500/50 mr-2">{'>'}</span> {log}
              </div>
            ))}
          </div>
        </div>

      </main>

      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl shadow-2xl"
          >
            Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border mt-8">
        <div className="flex items-center gap-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
          <span>Sentinel</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/akashka005"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2">
            <span>Github</span>
          </a>
          <span className="text-slate-200">/</span>
          <a
            href="https://www.linkedin.com/in/akashka005/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2"
          >
            <span>LinkedIn</span>
          </a>
          <span className="text-slate-200">/</span>
          <a
            href="mailto:akashka688@gmail.com"
            className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2"
          >
            <span>Contact</span>
          </a>
        </div>
      </footer>
    </div>
  );
}