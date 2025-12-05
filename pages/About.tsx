import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Info } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="bg-teal-100 dark:bg-teal-900/50 p-4 rounded-full text-teal-600 dark:text-teal-400">
            <Activity size={48} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About SugarTrack Web</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A modern, privacy-focused application designed to help you track, analyze, and manage your blood sugar levels effectively.
        </p>
        <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-full">
          Version 1.0.0
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Privacy First</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Your health data is yours alone. SugarTrack Web stores all your records locally in your browser. 
            We do not collect, track, or sell your personal medical information.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <HeartPulse size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Health Monitoring</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Easily record measurements in mg/dL or mmol/L. Visualize trends over time and get AI-powered insights 
            to understand how your lifestyle affects your glucose levels.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-6 flex gap-4">
        <Info className="text-amber-600 dark:text-amber-500 shrink-0 mt-1" size={24} />
        <div className="space-y-2">
          <h3 className="font-bold text-amber-900 dark:text-amber-200">Medical Disclaimer</h3>
          <p className="text-amber-800 dark:text-amber-300/80 text-sm leading-relaxed">
            SugarTrack Web is a tracking tool and is not intended to diagnose, treat, cure, or prevent any disease. 
            The AI insights provided are for informational purposes only. Always consult with a qualified healthcare 
            professional regarding your medical condition or treatment.
          </p>
        </div>
      </div>

      <div className="text-center text-slate-400 text-sm pt-8">
        <p>&copy; {new Date().getFullYear()} SugarTrack Web. All rights reserved.</p>
      </div>
    </div>
  );
};

export default About;
