import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, Activity, Moon, Sun } from 'lucide-react';
import { useSugar } from '../context/SugarContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useSugar();
  
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/add", icon: <PlusCircle size={20} />, label: "Add" },
    { to: "/history", icon: <History size={20} />, label: "History" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-teal-800 dark:bg-teal-900 text-white p-4 flex justify-between items-center shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-2">
            <Activity className="text-teal-300" />
            <h1 className="font-bold tracking-tight">SugarTrack</h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-teal-800 dark:bg-teal-950 text-white fixed h-full shadow-xl z-20 transition-colors duration-300">
        <div className="p-6 flex items-center justify-between border-b border-teal-700 dark:border-teal-900">
          <div className="flex items-center gap-2">
            <Activity className="text-teal-300" />
            <h1 className="text-xl font-bold tracking-tight">SugarTrack</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-teal-700 dark:bg-teal-900 text-white font-medium" 
                    : "text-teal-100 hover:bg-teal-700/50 dark:hover:bg-teal-900/50"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Desktop Theme Toggle at bottom of sidebar */}
        <div className="p-4 border-t border-teal-700 dark:border-teal-900">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-teal-100 hover:bg-teal-700/50 dark:hover:bg-teal-900/50 transition-colors"
          >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg z-50 px-6 py-3 flex justify-between items-center transition-colors duration-300">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs transition-colors ${
                isActive ? "text-teal-600 dark:text-teal-400 font-bold" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;