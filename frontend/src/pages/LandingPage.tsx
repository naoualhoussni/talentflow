import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, Brain, Shield, Users, BarChart3, FileText,
  ArrowRight, CheckCircle2, Star, Sparkles, Globe,
  TrendingUp, Award, ChevronRight, Play, MessageCircle,
  Briefcase, Target, Lock, Clock, Rocket
} from 'lucide-react';

// Animated counter hook
const useCounter = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!startOnView || isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, startOnView]);

  return { count, ref };
};

const LandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const stats = [
    { label: 'Entreprises', value: 2500, suffix: '+', icon: Globe },
    { label: 'Recrutements réussis', value: 45000, suffix: '+', icon: Users },
    { label: 'Temps gagné', value: 73, suffix: '%', icon: Clock },
    { label: 'Satisfaction', value: 98, suffix: '%', icon: Star },
  ];

  const features = [
    {
      icon: Brain,
      title: 'IA Prédictive',
      description: 'Algorithmes de machine learning pour prédire la compatibilité candidat-poste avec une précision de 94%.',
      color: 'from-violet-500 to-purple-600',
      highlights: ['Matching intelligent', 'Score de compatibilité', 'Analyse comportementale']
    },
    {
      icon: Shield,
      title: 'Évaluation des Risques',
      description: 'Détectez les risques de turnover et anticipez les besoins en rétention grâce à notre matrice 9-Box.',
      color: 'from-blue-500 to-cyan-500',
      highlights: ['Matrice 9-Box', 'Indicateurs de risque', 'Plans de rétention']
    },
    {
      icon: MessageCircle,
      title: 'Chatbot RH Intelligent',
      description: 'Assistant IA contextuel qui s\'adapte au rôle de chaque utilisateur pour un support personnalisé 24/7.',
      color: 'from-emerald-500 to-teal-500',
      highlights: ['Support 24/7', 'Réponses contextuelles', 'Apprentissage continu']
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Tableaux de bord en temps réel avec KPIs personnalisables et rapports automatisés.',
      color: 'from-amber-500 to-orange-500',
      highlights: ['Temps réel', 'KPIs personnalisés', 'Export automatique']
    },
    {
      icon: FileText,
      title: 'Gestion Documentaire',
      description: 'Automatisez la génération et le suivi de tous vos documents RH : congés, attestations, fiches de paie.',
      color: 'from-rose-500 to-pink-500',
      highlights: ['Génération auto', 'Workflow d\'approbation', 'Archivage sécurisé']
    },
    {
      icon: Target,
      title: 'Pipeline de Recrutement',
      description: 'Visualisez et optimisez chaque étape de votre processus de recrutement avec un pipeline interactif.',
      color: 'from-indigo-500 to-blue-600',
      highlights: ['Vue Kanban', 'Suivi temps réel', 'Automatisation']
    }
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'DRH, TechCorp',
      content: 'TalentFlow a transformé notre processus de recrutement. Nous avons réduit notre temps d\'embauche de 60% et amélioré la qualité de nos recrutements.',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Marc Dubois',
      role: 'CEO, InnoStart',
      content: 'L\'IA prédictive est bluffante. Le matching candidat-poste nous a permis de trouver des profils que nous n\'aurions jamais identifiés autrement.',
      rating: 5,
      avatar: 'M'
    },
    {
      name: 'Claire Lefebvre',
      role: 'Manager RH, GlobalSoft',
      content: 'Le chatbot RH a divisé par 3 le nombre de tickets support. Nos employés adorent avoir des réponses instantanées.',
      rating: 5,
      avatar: 'C'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '29',
      period: '/mois',
      description: 'Idéal pour les petites équipes',
      features: ['Jusqu\'à 25 employés', 'Chatbot IA basique', 'Gestion de documents', 'Support email'],
      popular: false
    },
    {
      name: 'Pro',
      price: '79',
      period: '/mois',
      description: 'Pour les entreprises en croissance',
      features: ['Jusqu\'à 100 employés', 'IA Prédictive complète', 'Analytics avancés', 'Pipeline de recrutement', 'Support prioritaire', 'Matrice 9-Box'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '199',
      period: '/mois',
      description: 'Solution complète sur mesure',
      features: ['Employés illimités', 'Toutes les fonctionnalités', 'API personnalisée', 'SLA garanti', 'Manager dédié', 'Formation incluse'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-emerald-400">TalentFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Témoignages</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Propulsé par l'Intelligence Artificielle
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Révolutionnez votre</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400">
                gestion des talents
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              La plateforme RH nouvelle génération qui combine intelligence artificielle, 
              analytics prédictifs et automatisation pour transformer votre capital humain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-3"
              >
                Démarrer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl font-medium text-lg transition-all flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Voir la démo
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl shadow-violet-500/5">
              <div className="rounded-xl bg-slate-900 p-6 border border-slate-800/30">
                {/* Fake dashboard header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 h-6 bg-slate-800 rounded-lg max-w-xs mx-auto" />
                </div>
                {/* Fake dashboard content */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['violet', 'blue', 'emerald', 'amber'].map((color, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${color}-500 to-${color}-700 mb-3 flex items-center justify-center`}>
                        <div className="w-5 h-5 bg-white/30 rounded" />
                      </div>
                      <div className="h-6 bg-slate-700/50 rounded w-16 mb-2" />
                      <div className="h-3 bg-slate-800 rounded w-24" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-48 rounded-xl bg-slate-800/50 border border-slate-700/30 p-4">
                    <div className="h-4 bg-slate-700/50 rounded w-32 mb-4" />
                    <div className="flex items-end gap-2 h-28">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
                          className="flex-1 bg-gradient-to-t from-violet-600 to-violet-400 rounded-sm opacity-60"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-48 rounded-xl bg-slate-800/50 border border-slate-700/30 p-4">
                    <div className="h-4 bg-slate-700/50 rounded w-20 mb-4" />
                    <div className="space-y-3">
                      {[75, 60, 85, 45].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-2 bg-slate-800 rounded-full flex-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${w}%` }}
                              transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trusted by */}
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-600 uppercase tracking-wider font-medium mb-8">
              Adopté par des entreprises innovantes
            </p>
            <div className="flex items-center justify-center gap-12 opacity-40">
              {['TechCorp', 'InnoStart', 'GlobalSoft', 'DataPrime', 'CloudNex'].map((name, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="text-lg font-bold text-slate-500 tracking-widest"
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const { count, ref } = useCounter(stat.value, 2000);
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {count.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
              <Rocket className="w-3 h-3" />
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Une suite complète d'outils intelligents pour automatiser et optimiser chaque aspect de votre gestion RH.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setActiveFeature(i)}
                className={`group p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeFeature === i
                    ? 'bg-slate-800/50 border-violet-500/30 shadow-xl shadow-violet-500/5 scale-[1.02]'
                    : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-700/50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.highlights.map((h, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
              <Award className="w-3 h-3" />
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Découvrez comment TalentFlow transforme la gestion RH de nos clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <TrendingUp className="w-3 h-3" />
              Tarification
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Un plan pour chaque besoin
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à la taille et aux ambitions de votre entreprise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-violet-600/10 border-violet-500/30 shadow-xl shadow-violet-500/10 scale-105'
                    : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-700/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                    Populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}€</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                      : 'border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
                  }`}
                >
                  Commencer
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-emerald-600/10 border border-violet-500/20 p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à transformer votre RH ?
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                Rejoignez les 2 500+ entreprises qui ont déjà fait confiance à TalentFlow pour révolutionner leur gestion des talents.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 group"
              >
                Essayer gratuitement pendant 14 jours
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-slate-500 mt-4">Aucune carte bancaire requise</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-4 h-4 fill-white" />
                </div>
                <span className="font-bold text-white">TalentFlow</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                La plateforme RH intelligente qui transforme votre gestion des talents.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-slate-300 transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-slate-300 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-300 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-300 transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Cookies</a></li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <a href="#" className="hover:text-slate-300 transition-colors">RGPD</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">© 2026 TalentFlow AI. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-slate-600 text-sm">
              <span>Fait avec 💜 à Paris</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
