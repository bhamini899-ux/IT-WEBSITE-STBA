import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  Bus, 
  HeartPulse, 
  Megaphone,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { ParentSchoolDocument, ChildProfile } from '../../types/parentConnect';

interface ParentDocumentsVaultProps {
  child: ChildProfile;
  documents: ParentSchoolDocument[];
  onOpenDocument: (doc: ParentSchoolDocument) => void;
}

export const ParentDocumentsVault: React.FC<ParentDocumentsVaultProps> = ({
  child,
  documents,
  onOpenDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const childDocs = documents.filter(d => !d.childId || d.childId === child.id);

  const categories = [
    { key: 'ALL', label: 'All Documents' },
    { key: 'Report Card', label: 'Report Cards' },
    { key: 'Fee Receipt', label: 'Fee Receipts' },
    { key: 'Identity Card', label: 'ID Cards' },
    { key: 'Transport Pass', label: 'Bus Pass' },
    { key: 'Circular', label: 'Circulars' },
    { key: 'Health Record', label: 'Health' }
  ];

  const filteredDocs = childDocs.filter(d => {
    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return d.title.toLowerCase().includes(q) || (d.fileType && d.fileType.toLowerCase().includes(q)) || d.format.toLowerCase().includes(q);
    }
    return true;
  });

  const getDocIcon = (category: ParentSchoolDocument['category']) => {
    switch (category) {
      case 'Report Card': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Fee Receipt': return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'Identity Card': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'Transport Pass': return <Bus className="w-5 h-5 text-amber-600" />;
      case 'Circular': return <Megaphone className="w-5 h-5 text-indigo-600" />;
      case 'Health Record': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Digital Document Vault
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Verified Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access, view in-browser, print, and securely download certified school documents for {child.name}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>CBSE Accredited Digitally Signed Archives</span>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {getDocIcon(doc.category)}
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {doc.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {doc.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {doc.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-3">
                <span>{doc.date || doc.issueDate}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span>{doc.fileType || doc.format}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onOpenDocument(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Document</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
