import React, { useRef, useState } from 'react';
import { useSugar } from '../context/SugarContext';
import { Download, Upload, Database, BrainCircuit, Loader2, AlertCircle, Settings2, Check } from 'lucide-react';
import { analyzeRecords } from '../services/geminiService';

const Settings = () => {
  const { exportData, importData, records, defaultUnit, setDefaultUnit } = useSugar();
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
      } else {
        setImportStatus({ msg: 'Invalid JSON file or data structure.', type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (records.length < 3) {
        setAiAnalysis("Not enough data to analyze. Please add at least 3 records.");
        return;
    }
    
    setIsAnalyzing(true);
    try {
        const result = await analyzeRecords(records);
        setAiAnalysis(result);
    } catch (e) {
        setAiAnalysis("Unable to generate analysis. Please ensure a valid API Key is set in the environment.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings & Tools</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your data and get insights.</p>
      </div>

      {/* App Preferences */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
                <Settings2 className="text-teal-600 dark:text-teal-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Preferences</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Customize your default application settings.</p>
        </div>
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Default Unit</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Select the unit used for new entries.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setDefaultUnit('mg/dL')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            defaultUnit === 'mg/dL' 
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                        aria-pressed={defaultUnit === 'mg/dL'}
                    >
                        mg/dL
                        {defaultUnit === 'mg/dL' && <Check size={14} />}
                    </button>
                    <button 
                        onClick={() => setDefaultUnit('mmol/L')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            defaultUnit === 'mmol/L' 
                            ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                        aria-pressed={defaultUnit === 'mmol/L'}
                    >
                        mmol/L
                        {defaultUnit === 'mmol/L' && <Check size={14} />}
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <BrainCircuit size={28} className="text-indigo-200" />
            <h3 className="text-xl font-bold">Smart Health Insight (Gemini AI)</h3>
        </div>
        <p className="text-indigo-100 mb-6 max-w-2xl">
            Analyze your recent blood sugar trends to find patterns and receive lifestyle tips. 
            Requires a Google Gemini API Key.
        </p>

        {!aiAnalysis && (
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-70"
            >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                {isAnalyzing ? "Analyzing..." : "Analyze My Data"}
            </button>
        )}

        {aiAnalysis && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-4">
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                    {aiAnalysis}
                </div>
                <button 
                    onClick={() => setAiAnalysis(null)}
                    className="mt-4 text-xs text-indigo-200 hover:text-white underline"
                >
                    Clear Analysis
                </button>
            </div>
        )}
      </section>

      {/* Data Management Section */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
                <Database className="text-teal-600 dark:text-teal-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Data Management</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Backup your logs to a JSON file or restore from a previous backup.</p>
        </div>
        
        <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-4">
                    <Download size={24} />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Export Data</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Save all your {records.length} records to a generic JSON file.</p>
                <button 
                    onClick={exportData}
                    className="mt-auto w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Download JSON
                </button>
            </div>

            {/* Import */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                    <Upload size={24} />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Import Data</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Restore records from a previously exported JSON file.</p>
                <input 
                    type="file" 
                    accept=".json" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Select File
                </button>
            </div>
        </div>

        {importStatus && (
            <div className={`mx-6 mb-6 p-3 rounded-lg flex items-center gap-2 text-sm ${
                importStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
                <AlertCircle size={16} />
                {importStatus.msg}
                <button onClick={() => setImportStatus(null)} className="ml-auto font-bold">&times;</button>
            </div>
        )}
      </section>

      <section className="text-center text-xs text-slate-400 pt-8">
        <p>SugarTrack Web &copy; {new Date().getFullYear()}</p>
        <p>This app stores data in your browser's Local Storage.</p>
      </section>
    </div>
  );
};

export default Settings;