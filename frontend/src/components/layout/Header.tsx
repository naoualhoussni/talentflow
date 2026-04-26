import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, Check, Clock, FileText, Users, Briefcase, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'action';
  read: boolean;
  icon: React.ElementType;
}

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Nouvelle candidature', message: 'David Laurent a postulé pour "Dev Full Stack Senior"', time: 'Il y a 5 min', type: 'info', read: false, icon: Users },
    { id: '2', title: 'Entretien confirmé', message: 'Emma Garcia a confirmé l\'entretien du 25/04 à 14h', time: 'Il y a 30 min', type: 'success', read: false, icon: Check },
    { id: '3', title: 'Document en attente', message: 'Attestation de travail demandée par Nicolas Rousseau', time: 'Il y a 1h', type: 'warning', read: false, icon: FileText },
    { id: '4', title: 'Analyse IA terminée', message: 'Le screening IA pour le poste "Data Scientist" est prêt', time: 'Il y a 2h', type: 'action', read: true, icon: Zap },
    { id: '5', title: 'Nouveau poste publié', message: '"Marketing Manager" a été publié avec succès', time: 'Il y a 3h', type: 'success', read: true, icon: Briefcase },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Search results
  const searchResults = [
    { type: 'Candidat', name: 'David Laurent', detail: 'Dev Full Stack Senior', path: '/candidates' },
    { type: 'Candidat', name: 'Emma Garcia', detail: 'UX Designer', path: '/candidates' },
    { type: 'Poste', name: 'Développeur Full Stack', detail: '12 candidatures', path: '/jobs' },
    { type: 'Poste', name: 'UX Designer', detail: '8 candidatures', path: '/jobs' },
    { type: 'Document', name: 'Attestation de travail', detail: 'En attente', path: '/rh-document-management' },
    { type: 'Employé', name: 'Thomas Bernard', detail: 'Développement', path: '/employees' },
  ].filter(r => 
    searchQuery.length >= 2 && (
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.detail.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const typeColors = {
    info: 'bg-blue-500/10 text-blue-400',
    success: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400',
    action: 'bg-violet-500/10 text-violet-400',
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 relative z-40">
      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher candidats, postes, documents..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
          onFocus={() => setShowSearchResults(true)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
            >
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => { navigate(result.path); setSearchQuery(''); setShowSearchResults(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    {result.type === 'Candidat' && <Users className="w-4 h-4 text-violet-400" />}
                    {result.type === 'Poste' && <Briefcase className="w-4 h-4 text-blue-400" />}
                    {result.type === 'Document' && <FileText className="w-4 h-4 text-amber-400" />}
                    {result.type === 'Employé' && <Users className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{result.name}</p>
                    <p className="text-xs text-slate-500">{result.type} · {result.detail}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 ml-6">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors group"
          >
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif, i) => (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => markAsRead(notif.id)}
                      className={`w-full flex items-start gap-3 p-4 transition-colors text-left border-b border-slate-800/50 last:border-0 ${
                        notif.read ? 'bg-transparent hover:bg-slate-800/30' : 'bg-violet-500/5 hover:bg-violet-500/10'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                        <notif.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${notif.read ? 'text-slate-400' : 'text-white'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-800">
                  <button className="w-full py-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors rounded-lg hover:bg-slate-800/50">
                    Voir toutes les notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-slate-700"></div>

        {/* User Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 hover:bg-slate-800/50 px-3 py-1.5 rounded-xl transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
