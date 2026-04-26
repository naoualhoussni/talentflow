import React from 'react';
import { Printer, Download, X } from 'lucide-react';

interface RHApprovalFormProps {
  candidate: any;
  onClose: () => void;
}

const RHApprovalForm: React.FC<RHApprovalFormProps> = ({ candidate, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Data Simulation Logic
  const experienceFactor = candidate.experienceYears || 5;
  const baseSalary = 12000 + (experienceFactor * 1500);
  const panier = 550;
  const transport = 550;
  const loyer = baseSalary * 0.1;
  const totalBrut = baseSalary + panier + transport + loyer;
  const totalNet = totalBrut * 0.76; // Approx net for Morocco

  const orgDetails = [
    { label: 'Site (Succursale)', value: 'Siège Casablanca' },
    { label: 'Entité Organisationnelle', value: candidate.job?.department || 'Direction Technique' },
    { label: 'Fonction', value: candidate.job?.title || 'Responsable Support' },
    { label: 'Emploi de référence', value: `E${12 + Math.floor(experienceFactor/2)}.30 - Senior Specialist` },
    { label: 'Type de rémunération', value: 'Direct / Indirect' },
    { label: 'Grade', value: experienceFactor > 8 ? 'G1' : experienceFactor > 4 ? 'G2' : 'G3' }
  ];

  const salaryDetails = [
    { label: 'Salaire de base', value: `${baseSalary.toLocaleString()} MAD` },
    { label: 'Indemnité Panier', value: `${panier.toLocaleString()} MAD` },
    { label: 'Indemnité Transport', value: `${transport.toLocaleString()} MAD` },
    { label: 'Indemnité Loyer', value: `${loyer.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD` },
    { label: 'Salaire mensuel brut', value: `${totalBrut.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`, bold: true },
    { label: 'Salaire mensuel net', value: `${totalNet.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`, bold: true, color: 'text-blue-800' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-none shadow-2xl my-8 print:my-0 print:shadow-none relative">
        
        {/* Actions bar - hidden on print */}
        <div className="absolute -top-12 right-0 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg"
          >
            <Printer className="w-4 h-4" /> Imprimer / PDF
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all shadow-lg"
          >
            <X className="w-4 h-4" /> Fermer
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 font-sans print:p-0" id="rh-approval-form">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic">Auto Nejma</h1>
              <p className="text-[10px] uppercase font-bold text-slate-500">Mercedes-Benz Morocco</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-800">Demande d'Approbation RH</h2>
              <p className="text-xs text-slate-500 italic">Merci de renseigner tous les champs en couleur grise</p>
            </div>
          </div>

          {/* Top Info Bar */}
          <div className="grid grid-cols-3 gap-0 mb-6 border border-slate-900 bg-slate-900 text-white text-[10px] font-bold uppercase">
            <div className="flex border-r border-slate-700">
              <div className="p-2 bg-slate-700 w-1/2">Nature de la demande RH</div>
              <div className="p-2 w-1/2 text-center bg-white text-slate-900">Recrutement</div>
            </div>
            <div className="flex border-r border-slate-700">
              <div className="p-2 bg-slate-700 w-1/2">Budgétisation RH</div>
              <div className="p-2 w-1/2 text-center bg-white text-slate-900">Oui</div>
            </div>
            <div className="flex">
              <div className="p-2 bg-slate-700 w-1/2">Date d'application</div>
              <div className="p-2 w-1/2 text-center bg-white text-slate-900">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="space-y-4">
            {/* General Info */}
            <section>
              <h3 className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase mb-1">Informations générales</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Nom du collaborateur</div>
                  <div className="w-2/3 p-1 font-bold italic text-blue-800">{candidate.name}</div>
                </div>
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Email</div>
                  <div className="w-2/3 p-1">{candidate.email}</div>
                </div>
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Date d'embauche</div>
                  <div className="w-2/3 p-1">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Personnes à charge</div>
                  <div className="w-2/3 p-1">0</div>
                </div>
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Expérience</div>
                  <div className="w-2/3 p-1">{candidate.experienceYears} ans</div>
                </div>
                <div className="flex border border-slate-300">
                  <div className="w-1/3 bg-slate-100 p-1 font-semibold">Situation Familiale</div>
                  <div className="w-2/3 p-1">Célibataire</div>
                </div>
              </div>
            </section>

            {/* Organizational Info */}
            <section>
              <h3 className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase mb-1">Informations organisationnelles</h3>
              <div className="border border-slate-300">
                <div className="grid grid-cols-2 bg-slate-500 text-white text-[10px] font-bold text-center">
                  <div className="p-1 border-r border-slate-300">Intitulé</div>
                  <div className="p-1">Situation Proposée</div>
                </div>
                {orgDetails.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 text-[10px] border-t border-slate-300">
                    <div className="p-1 bg-slate-100 font-semibold border-r border-slate-300">{row.label}</div>
                    <div className="p-1 text-blue-800 font-medium italic">{row.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Salary Situation */}
            <section>
              <h3 className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase mb-1">Situation salariale</h3>
              <div className="border border-slate-300">
                <div className="grid grid-cols-3 bg-slate-500 text-white text-[10px] font-bold text-center">
                  <div className="p-1 border-r border-slate-300 col-span-2">Rubrique</div>
                  <div className="p-1">Situation Proposée</div>
                </div>
                {salaryDetails.map((row, i) => (
                  <div key={i} className={`grid grid-cols-3 text-[10px] border-t border-slate-300 ${row.bold ? 'font-bold bg-slate-50' : ''}`}>
                    <div className="p-1 bg-slate-100 font-semibold border-r border-slate-300 col-span-2">{row.label}</div>
                    <div className={`p-1 text-right ${row.color || 'text-blue-600'} italic`}>{row.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Comments */}
            <section>
              <h3 className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase mb-1">Commentaires</h3>
              <div className="border border-slate-300 p-2 min-h-[60px] text-[10px] bg-emerald-50/50 italic text-slate-700">
                {candidate.aiSummary || `Recrutement pour le renforcement de l'équipe ${candidate.job?.department || ''}.`}
                <br />
                <strong>Justification IA :</strong> Ce candidat présente un score de {candidate.score}/100 avec une forte adéquation sur les compétences techniques requises.
              </div>
            </section>

            {/* Approvals */}
            <section className="mt-8">
              <div className="grid grid-cols-4 gap-2">
                {['Directeur Hiérarchique', 'Directeur Fonctionnel', 'Directeur RH', 'Directeur Général'].map((title, i) => (
                  <div key={i} className="border border-slate-400 p-2 text-center h-32 flex flex-col justify-between">
                    <h4 className="text-[9px] font-bold uppercase border-b border-slate-300 pb-1 mb-2">{title}</h4>
                    <div className="flex-1 flex items-center justify-center italic text-slate-300 opacity-50 text-[10px]">
                      {i === 2 && <div className="text-blue-800 opacity-100 font-bold border-2 border-blue-800 p-1 rotate-[-5deg]">APPROUVÉ</div>}
                      {i === 3 && <div className="text-blue-600 opacity-100 font-bold">Signé par CEO</div>}
                    </div>
                    <div className="text-[8px] text-slate-400 text-left">
                      Nom: ______________<br />
                      Date: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 text-[8px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
            <span>Généré par TalentFlow AI Platform</span>
            <span>Document Confidentiel - Auto Nejma Morocco</span>
            <span>Version 2.4 - Réf: RH-APP-2026</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #rh-approval-form, #rh-approval-form * { visibility: visible; }
          #rh-approval-form {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default RHApprovalForm;
