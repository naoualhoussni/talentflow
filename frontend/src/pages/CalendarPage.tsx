import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, Users, MapPin, Video,
  ChevronLeft, ChevronRight, Plus, Filter, Search,
  CheckCircle2, AlertCircle, XCircle, Briefcase, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Interview {
  id: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  duration: string;
  type: 'VIDEO' | 'IN_PERSON' | 'PHONE';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  interviewers: string[];
  notes?: string;
}

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showNewModal, setShowNewModal] = useState(false);

  // Simulated interview data
  const interviews: Interview[] = [
    {
      id: '1',
      candidateName: 'David Laurent',
      jobTitle: 'Développeur Full Stack Senior',
      date: '2026-04-25',
      time: '10:00',
      duration: '1h',
      type: 'VIDEO',
      status: 'SCHEDULED',
      interviewers: ['Jean Dupont', 'Marie Martin'],
      notes: 'Entretien technique - focus sur React et Node.js'
    },
    {
      id: '2',
      candidateName: 'Emma Garcia',
      jobTitle: 'UX Designer',
      date: '2026-04-25',
      time: '14:00',
      duration: '45min',
      type: 'IN_PERSON',
      status: 'SCHEDULED',
      interviewers: ['Jean Dupont'],
      notes: 'Présentation portfolio et exercice pratique'
    },
    {
      id: '3',
      candidateName: 'Lucas Moreau',
      jobTitle: 'Data Scientist',
      date: '2026-04-28',
      time: '11:00',
      duration: '1h',
      type: 'VIDEO',
      status: 'SCHEDULED',
      interviewers: ['Marie Martin', 'Pierre Durand'],
      notes: 'Entretien technique ML/Python'
    },
    {
      id: '4',
      candidateName: 'Sophie Blanc',
      jobTitle: 'Chef de Projet',
      date: '2026-04-22',
      time: '09:30',
      duration: '1h',
      type: 'IN_PERSON',
      status: 'COMPLETED',
      interviewers: ['Jean Dupont'],
      notes: 'Entretien réussi - passage à l\'étape offre'
    },
    {
      id: '5',
      candidateName: 'Antoine Leclerc',
      jobTitle: 'Développeur Full Stack Senior',
      date: '2026-04-20',
      time: '16:00',
      duration: '30min',
      type: 'PHONE',
      status: 'CANCELLED',
      interviewers: ['Marie Martin'],
      notes: 'Candidat a décliné l\'offre'
    },
    {
      id: '6',
      candidateName: 'Marie Fontaine',
      jobTitle: 'Marketing Manager',
      date: '2026-04-30',
      time: '10:30',
      duration: '1h',
      type: 'VIDEO',
      status: 'SCHEDULED',
      interviewers: ['Jean Dupont', 'Camille Leroy'],
    },
  ];

  // Calendar helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday start
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getInterviewsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return interviews.filter(i => i.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const statusConfig = {
    SCHEDULED: { label: 'Planifié', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    COMPLETED: { label: 'Terminé', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    CANCELLED: { label: 'Annulé', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  };

  const typeConfig = {
    VIDEO: { label: 'Visio', icon: Video, color: 'text-violet-400' },
    IN_PERSON: { label: 'Présentiel', icon: MapPin, color: 'text-emerald-400' },
    PHONE: { label: 'Téléphone', icon: Users, color: 'text-blue-400' },
  };

  const upcomingInterviews = interviews
    .filter(i => i.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendrier des Entretiens</h1>
          <p className="text-slate-400 mt-1">Planifiez et gérez vos sessions de recrutement</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" />
            Nouvel entretien
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-violet-400 hover:bg-violet-500/10 transition-colors"
              >
                Aujourd'hui
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayInterviews = getInterviewsForDate(day);
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square p-1 rounded-xl text-sm transition-all relative group ${
                    isToday(day)
                      ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300'
                      : isSelected
                        ? 'bg-slate-800 border border-slate-600 text-white'
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday(day) ? 'text-violet-300' : ''}`}>
                    {day}
                  </span>
                  {dayInterviews.length > 0 && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayInterviews.slice(0, 3).map((interview, j) => (
                        <div
                          key={j}
                          className={`w-1.5 h-1.5 rounded-full ${
                            interview.status === 'COMPLETED' ? 'bg-emerald-500' :
                              interview.status === 'CANCELLED' ? 'bg-red-500' : 'bg-violet-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date details */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 border-t border-slate-800 pt-6"
            >
              <h3 className="text-sm font-semibold text-slate-400 mb-4">
                Entretiens du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </h3>
              {interviews.filter(i => i.date === selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {interviews.filter(i => i.date === selectedDate).map(interview => {
                    const status = statusConfig[interview.status];
                    const type = typeConfig[interview.type];
                    return (
                      <div key={interview.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-white text-sm">{interview.candidateName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{interview.jobTitle}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {interview.time} ({interview.duration})
                          </span>
                          <span className={`flex items-center gap-1 ${type.color}`}>
                            <type.icon className="w-3 h-3" />
                            {type.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Aucun entretien ce jour</p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Upcoming Interviews Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-400" />
            Prochains entretiens
          </h2>

          <div className="space-y-4">
            {upcomingInterviews.map((interview, i) => {
              const type = typeConfig[interview.type];
              const TypeIcon = type.icon;
              return (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {interview.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{interview.candidateName}</p>
                      <p className="text-xs text-slate-400 truncate">{interview.jobTitle}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(interview.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {interview.time}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${type.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {type.label}
                        </span>
                      </div>
                      {interview.interviewers.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <User className="w-3 h-3 text-slate-600" />
                          <span className="text-xs text-slate-600">
                            {interview.interviewers.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-6 space-y-3 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Cette semaine</span>
              <span className="font-semibold text-white">{interviews.filter(i => i.status === 'SCHEDULED').length} entretiens</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Taux de complétion</span>
              <span className="font-semibold text-emerald-400">
                {Math.round((interviews.filter(i => i.status === 'COMPLETED').length / interviews.length) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Annulations</span>
              <span className="font-semibold text-red-400">
                {interviews.filter(i => i.status === 'CANCELLED').length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarPage;
