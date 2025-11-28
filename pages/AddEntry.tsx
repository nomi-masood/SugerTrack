import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSugar } from '../context/SugarContext';
import { CATEGORIES, CONVERSION_FACTOR } from '../constants';
import { TimeCategory, Unit } from '../types';
import { ArrowLeftRight, Save, Clock, FilePenLine, ChevronDown } from 'lucide-react';

const AddEntry = () => {
  const { addRecord, defaultUnit } = useSugar();
  const navigate = useNavigate();

  const [category, setCategory] = useState<TimeCategory | ''>('');
  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [notes, setNotes] = useState('');

  const handleConvert = () => {
    if (!value) return;
    const numVal = parseFloat(value);
    if (isNaN(numVal)) return;

    if (unit === 'mg/dL') {
      // Convert mg/dL to mmol/L
      const converted = numVal / CONVERSION_FACTOR;
      setValue(converted.toFixed(1));
      setUnit('mmol/L');
    } else {
      // Convert mmol/L to mg/dL
      const converted = numVal * CONVERSION_FACTOR;
      setValue(Math.round(converted).toString());
      setUnit('mg/dL');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !value) return;

    addRecord({
      timestamp: Date.now(),
      category: category as TimeCategory,
      value: parseFloat(value),
      unit,
      notes,
    });
    navigate('/history');
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">New Record</h2>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 space-y-6">
          
          {/* Category Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Time Category</label>
            <div className="relative">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TimeCategory)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-slate-800 dark:text-white transition-all cursor-pointer"
                    required
                >
                    <option value="" disabled>Select a time category...</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Value and Unit */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Sugar Level</label>
            <div className="flex items-stretch gap-2">
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.0"
                className="flex-1 min-w-0 px-4 py-3 text-2xl font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                required
              />
              
              <div className="relative w-28 sm:w-32">
                 <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="w-full h-full pl-3 pr-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none font-medium text-slate-700 dark:text-slate-200 text-sm sm:text-base"
                 >
                     <option value="mg/dL">mg/dL</option>
                     <option value="mmol/L">mmol/L</option>
                 </select>
                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                className="px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 flex items-center justify-center"
                title="Convert Value"
              >
                <ArrowLeftRight size={20} />
              </button>
            </div>
             <p className="text-xs text-slate-400 pl-1">
               {unit === 'mg/dL' ? 'Button converts to mmol/L (÷ 18)' : 'Button converts to mg/dL (× 18)'}
             </p>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FilePenLine size={16} /> Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ate a large pizza..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          {/* Read-only Timestamp */}
          <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
            <Clock size={12} />
            <span>Recording time: {new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end transition-colors">
          <button
            type="submit"
            disabled={!category || !value}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-teal-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save size={18} />
            Save Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEntry;