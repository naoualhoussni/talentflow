import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Workflow, 
  ShieldAlert, 
  Settings, 
  LogOut,
  Zap,
  FileText,
  Shield,
  Brain,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  // Define which roles can see which items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['RH', 'MANAGER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/candidate-dashboard', roles: ['CANDIDATE'] },
    { icon: Briefcase, label: 'Offres d\'emploi', path: '/jobs', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: Briefcase, label: 'Offres recommandées', path: '/candidate-dashboard#jobs', roles: ['CANDIDATE'] },
    { icon: Users, label: 'Candidats', path: '/candidates', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: Workflow, label: 'Pipeline', path: '/pipeline', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: Calendar, label: 'Entretiens', path: '/calendar', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: ShieldAlert, label: 'Risques Employés', path: '/employees', roles: ['RH', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: FileText, label: 'Mes Documents', path: '/my-documents', roles: ['EMPLOYEE'] },
    { icon: Users, label: 'Gestion Documents', path: '/rh-document-management', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: ShieldAlert, label: 'Matrice 9 Box', path: '/nine-box-matrix', roles: ['RH', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    { icon: Brain, label: 'Analyse IA', path: '/matching-analysis', roles: ['CANDIDATE'] },
    { icon: Shield, label: 'Administration', path: '/administration', roles: ['SUPER_ADMIN'] },
    { icon: User, label: 'Mon Profil', path: '/profile', roles: ['RH', 'MANAGER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'CANDIDATE'] },
    { icon: Settings, label: 'Paramètres', path: '/settings', roles: ['RH', 'MANAGER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'CANDIDATE'] },
  ];

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  // Group items
  const mainItems = filteredItems.filter(i => !['/profile', '/settings'].includes(i.path));
  const bottomItems = filteredItems.filter(i => ['/profile', '/settings'].includes(i.path));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen overflow-hidden transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Zap className="text-white w-6 h-6 fill-white" />
        </div>
        <span className="text-2xl font-bold gradient-text tracking-tight">TalentFlow</span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Main menu */}
        <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Menu principal</p>
        {mainItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
              isActive 
                ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              "group-[.active]:text-violet-400"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}

        {/* Account section */}
        <div className="pt-4">
          <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Compte</p>
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                "group-[.active]:text-violet-400"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-6">
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold truncate text-slate-200">{user?.name}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
