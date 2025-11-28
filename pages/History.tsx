import React, { useState, useMemo, useEffect } from 'react';
import { useSugar } from '../context/SugarContext';
import { CATEGORIES, CONVERSION_FACTOR } from '../constants';
import { Search, Filter, Trash2, Calendar, Edit2, X, ArrowLeftRight, Save, ChevronDown } from 'lucide-react';
import { SugarRecord, TimeCategory, Unit } from '../types';

const History = () => {
  const { records, deleteRecord, updateRecord } = useSugar();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<TimeCategory | ''>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editUnit, setEditUnit] = useState<Unit>('mg/dL');
  const [editNotes, setEditNotes] = useState('');
  const [editTimestamp, setEditTimestamp] = useState<number>(0);

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        const matchesSearch = 
          new Date(record.timestamp).toLocaleDateString().includes(searchTerm) ||
          (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = filterCategory ? record.category === filterCategory : true;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first
  }, [records, searchTerm, filterCategory]);

  const getSecondaryValue = (val: number, unit: string) => {
    if (unit === 'mg/dL') return `${(val / CONVERSION_FACTOR).toFixed(1)} mmol/L`;
    return `${Math.round(val * CONVERSION_FACTOR)} mg/dL`;
  };

  const handleEditClick = (record: SugarRecord) => {
    setEditingId(record.id);
    setEditCategory(record.category);
    setEditValue(record.value.toString());
    setEditUnit(record.unit);
    setEditNotes(record.notes);
    setEditTimestamp(record.timestamp);
  };

  const handleConvertEdit = () => {
    if (!editValue) return;
    const numVal = parseFloat(editValue);
    if (isNaN(numVal)) return;

    if (editUnit === 'mg/dL') {
      // Convert mg/dL to mmol/L
      const converted = numVal / CONVERSION_FACTOR;
      setEditValue(converted.toFixed(1));
      setEditUnit('mmol/L');
    } else {
      // Convert mmol/L to mg/dL
      const converted = numVal * CONVERSION_FACTOR;
      setEditValue(Math.round(converted).toString());
      setEditUnit('mg/dL');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCategory || !editValue) return;

    const updatedRecord: SugarRecord = {
      id: editingId,
      timestamp: editTimestamp,
      category: editCategory as TimeCategory,
      value: parseFloat(editValue),
      unit: editUnit,
      notes: editNotes,
    };

    updateRecord(updatedRecord);
    setEditingId(null); // Close modal
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">History Log</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">{records.length} total records found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by date or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
        <div className="relative w-full md:w-64">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <select 
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-slate-800 dark:text-slate-100"
           >
             <option value="">All Categories</option>
             {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase rounded-md tracking-wide">
                        {record.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12}/>
                        {new Date(record.timestamp).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{record.value}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{record.unit}</span>
                    <span className="text-xs text-slate-400 border-l pl-2 border-slate-200 dark:border-slate-600">
                        ({getSecondaryValue(record.value, record.unit)})
                    </span>
                  </div>

                  {record.notes && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg italic border border-slate-100 dark:border-slate-700 inline-block">
                        "{record.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => handleEditClick(record)}
                        className="p-2 text-slate-300 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                        title="Edit Record"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if(window.confirm('Delete this record?')) deleteRecord(record.id);
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Record"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
            <p>No records found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Record</h3>
              <button 
                onClick={() => setEditingId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Time Category</label>
                 <div className="relative">
                    <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as TimeCategory)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-slate-800 dark:text-white"
                        required
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Value & Unit */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sugar Level</label>
                <div className="flex items-stretch gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-3 text-xl font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  
                  <div className="relative w-28">
                     <select
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value as Unit)}
                        className="w-full h-full pl-3 pr-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none font-medium text-slate-700 dark:text-slate-200 text-sm"
                     >
                         <option value="mg/dL">mg/dL</option>
                         <option value="mmol/L">mmol/L</option>
                     </select>
                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <button
                    type="button"
                    onClick={handleConvertEdit}
                    className="px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-800"
                    title="Convert Value"
                  >
                    <ArrowLeftRight size={20} />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-slate-700 dark:text-slate-200"
                  rows={3}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md shadow-teal-200 dark:shadow-none transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;