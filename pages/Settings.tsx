import React, { useRef, useState } from 'react';
import { useSugar } from '../context/SugarContext';
import { Download, Upload, BrainCircuit, Loader2, AlertCircle, Moon, Sun, Smartphone, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { analyzeRecords } from '../services/geminiService';

const Settings = () => {
  const { exportData, importData, records, defaultUnit, setDefaultUnit, theme, toggleTheme } = useSugar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus({ msg: 'Database imported successfully!', type: 'success' });
        // Clear success message after 3 seconds
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus({ msg: 'Invalid JSON file structure.', type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (records.length < 3) {
        setAiAnalysis("Not enough data. Please add at least 3 records to generate insights.");
        return;
    }
    
    setIsAnalyzing(true);
    try {
        const result = await analyzeRecords(records);
        setAiAnalysis(result);
    } catch (e) {
        setAiAnalysis("Unable to generate analysis. Please ensure the API service is available.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your preferences and data.</p>
      </div>

      {/* General Settings Group */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 pl-1">General</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden shadow-sm transition-colors">
            
            {/* Default Unit */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-100">Default Unit</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Preferred unit for new entries</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {(['mg/dL', 'mmol/L'] as const).map((u) => (
                        <button
                        key={u}
                        onClick={() => setDefaultUnit(u)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            defaultUnit === u 
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        >
                        {u}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div 
                onClick={toggleTheme}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-100">Appearance</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
            </div>
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 pl-1">Intelligence</h3>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <BrainCircuit size={24} className="text-indigo-100" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Smart Analysis</h3>
                        <p className="text-indigo-200 text-xs">Powered by Gemini AI</p>
                    </div>
                </div>
            </div>
            
            <p className="text-indigo-100 text-sm mb-6 relative z-10">
                Get personalized insights, trend identification, and lifestyle tips based on your recent sugar logs.
            </p>

            {!aiAnalysis ? (
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                    {isAnalyzing ? "Analyzing Data..." : "Analyze My Data"}
                </button>
            ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {aiAnalysis}
                    </div>
                    <button 
                        onClick={() => setAiAnalysis(null)}
                        className="mt-4 w-full py-2 text-xs font-medium text-indigo-200 hover:text-white bg-indigo-900/30 hover:bg-indigo-900/50 rounded-lg transition-colors"
                    >
                        Close Analysis
                    </button>
                </div>
            )}
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 pl-1">Data Management</h3>
        
        {importStatus && (
             <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 text-sm border animate-in slide-in-from-top-2 ${
                importStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}>
                {importStatus.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                {importStatus.msg}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export Card */}
            <button 
                onClick={exportData} 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Download size={22} />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Export Backup</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Save records to JSON file</span>
            </button>

            {/* Import Card */}
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
                <input 
                    type="file" 
                    accept=".json" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                />
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Upload size={22} />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Import Data</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Restore from JSON file</span>
            </button>
        </div>
      </section>

      {/* About App */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 pl-1">About</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden shadow-sm transition-colors">
            
            {/* Install Info */}
            <div className="p-4 flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Smartphone size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">Install Application</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Add to Home Screen for the best experience.
                    </p>
                </div>
                {/* Disclosure arrow / Hint */}
                <div className="hidden sm:block text-xs font-medium text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                    PWA Ready
                </div>
            </div>

            {/* Version Footer */}
            <div className="p-3 text-center bg-slate-50 dark:bg-slate-900/50">
                <p className="text-xs text-slate-400">
                    SugarTrack Web v1.2 • Data stored locally
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
