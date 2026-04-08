/**
 * PRESSING MANAGER COMPONENT (PREMIUM RICH EDITION)
 * Designed with luxurious depth, glassmorphism, and integrated blacklist controls.
 * Features ultra-clean layouts and refined scheduling for a premium owner experience.
 */

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Factory, 
  Scale, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Calendar,
  MoreHorizontal,
  ChevronRight,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

interface PressingManagerProps {
  pressingRequests: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  highlightedId: string | null;
  onRefresh: () => void;
  isArchived?: boolean;
}

const PressingManager: React.FC<PressingManagerProps> = ({
  pressingRequests,
  searchTerm,
  setSearchTerm,
  highlightedId,
  onRefresh,
  isArchived = false
}) => {
  const { t } = useTranslation();
  const { request } = useApi();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteValue, setTempNoteValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewFilter, setViewFilter] = useState<"all" | "waitlist" | "scheduled">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [dateEditingId, setDateEditingId] = useState<string | null>(null);
  const [tempDates, setTempDates] = useState({ bring: "", collect: "" });

  const updatePressingStatus = async (id: string, status: string) => {
    try {
      await request(`/pressing/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      toast.success("Statut mis à jour");
      onRefresh();
    } catch (err) {}
  };

  const toggleBlacklist = async (userId: string, requestId: string) => {
    if (!userId) return;
    setActionLoadingId(requestId);
    try {
      await request(`/users/${userId}/blacklist`, { method: 'PATCH' });
      toast.success("Statut client mis à jour");
      onRefresh();
    } catch (err) {
      toast.error("Échec de l'action");
    } finally {
      setActionLoadingId(null);
    }
  };

  const updateDates = async (id: string) => {
    try {
      await request(`/pressing/${id}/dates`, {
        method: 'PATCH',
        body: {
          bring_olives_date: tempDates.bring,
          collect_oil_date: tempDates.collect
        }
      });
      toast.success("Dates confirmées");
      setDateEditingId(null);
      onRefresh();
    } catch (err) {}
  };

  const archivePressing = async (id: string) => {
    try {
      await request(`/pressing/${id}/archive`, { method: 'PATCH' });
      toast.success("Archivé");
      onRefresh();
    } catch (err) {}
  };

  const filteredRequests = useMemo(() => {
    return pressingRequests.filter(r => {
      const searchStr = `${r._id} ${r.user_id?.first_name} ${r.user_id?.last_name} ${r.user_id?.phone} ${r.user_id?.email}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesView = viewFilter === 'all' || (viewFilter === 'waitlist' && !r.bring_olives_date) || (viewFilter === 'scheduled' && r.bring_olives_date);
      return matchesSearch && matchesStatus && matchesView;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [pressingRequests, searchTerm, statusFilter, viewFilter]);

  return (
    <div className="space-y-12">
      {/* Search & Refined Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight text-foreground/90 uppercase text-primary/80">{isArchived ? "Archives" : "Trituration"}</h2>
          <div className="h-px w-12 bg-primary/30 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
        </div>

        <div className="flex flex-wrap items-center gap-8">
           <div className="flex gap-8 border-b border-transparent">
              <button onClick={() => setViewFilter('all')} className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2", viewFilter === 'all' ? "border-primary text-primary" : "border-transparent text-muted-foreground/40")}>Tous</button>
              <button onClick={() => setViewFilter('waitlist')} className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2", viewFilter === 'waitlist' ? "border-amber-400 text-amber-600" : "border-transparent text-muted-foreground/40")}>Sans RDV</button>
              <button onClick={() => setViewFilter('scheduled')} className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2", viewFilter === 'scheduled' ? "border-indigo-400 text-indigo-600" : "border-transparent text-muted-foreground/40")}>Programmés</button>
           </div>

           <div className="relative w-64 group/search">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20 group-focus-within/search:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 py-2 bg-transparent text-sm border-b border-border/50 focus:outline-none focus:border-primary transition-all font-light"
              />
           </div>
        </div>
      </div>

      {/* Aesthetic rows with Depth */}
      <div className="divide-y divide-border/20 px-4">
        {filteredRequests.map(r => (
          <div 
            key={r._id} 
            className={cn(
              "py-12 transition-all group relative overflow-hidden",
              highlightedId === r._id && "bg-primary/[0.01] rounded-3xl px-6",
              r.user_id?.is_blacklisted && "opacity-70 grayscale-[0.3]"
            )}
          >
            {/* Glass Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none backdrop-blur-[1px]" />

            <div className="flex flex-col lg:flex-row justify-between gap-12 items-start relative z-10">
              {/* Producer & Core Data */}
              <div className="flex-1 space-y-8">
                <div>
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase border border-border/20 px-2 py-0.5 rounded">Réf: {r._id.slice(-6).toUpperCase()}</span>
                     {!r.bring_olives_date && r.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />}
                     {r.user_id?.is_blacklisted && (
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-tighter">
                          <ShieldAlert className="w-3 h-3" /> Client Blacklisté
                       </span>
                     )}
                   </div>
                   <h4 className="text-2xl font-light tracking-tight text-foreground/80 group-hover:text-foreground transition-all duration-500">{r.user_id?.first_name} {r.user_id?.last_name}</h4>
                   <div className="flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground/40 font-medium mt-2">
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 opacity-30" /> {r.user_id?.phone}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-2 font-bold text-foreground/60"><Scale className="w-3.5 h-3.5" /> {r.olive_quantity_kg.toLocaleString()} kg</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-2 italic">{r.oil_quality || "Vierge Extra"}</span>
                   </div>
                </div>

                {/* Scheduling logic - Glass Slates */}
                <div className="flex flex-wrap gap-10 pt-4">
                   <div className="space-y-2 group/date">
                      <p className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] group-hover/date:text-primary transition-colors">Apport</p>
                      {dateEditingId === r._id ? (
                        <input 
                          type="date" 
                          value={tempDates.bring} 
                          onChange={(e) => setTempDates({...tempDates, bring: e.target.value})}
                          className="bg-secondary/10 border-b border-primary/30 outline-none text-xs p-1 rounded-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-3 bg-secondary/5 px-4 py-2 rounded-xl border border-border/30 shadow-inner group-hover/date:border-primary/20 transition-all">
                           <Calendar className="w-3.5 h-3.5 text-primary/40" />
                           <span className={cn("text-xs font-bold", r.bring_olives_date ? "text-foreground" : "text-amber-500 italic")}>
                             {r.bring_olives_date ? new Date(r.bring_olives_date).toLocaleDateString() : "Non fixé"}
                           </span>
                        </div>
                      )}
                   </div>
                   <div className="space-y-2 group/date">
                      <p className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] group-hover/date:text-indigo-500 transition-colors">Collecte</p>
                      {dateEditingId === r._id ? (
                        <input 
                          type="date" 
                          value={tempDates.collect} 
                          onChange={(e) => setTempDates({...tempDates, collect: e.target.value})}
                          className="bg-secondary/10 border-b border-primary/30 outline-none text-xs p-1 rounded-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-3 bg-secondary/5 px-4 py-2 rounded-xl border border-border/30 shadow-inner group-hover/date:border-indigo-500/20 transition-all">
                           <Clock className="w-3.5 h-3.5 text-indigo-400 opacity-40" />
                           <span className="text-xs font-bold text-muted-foreground/80">
                             {r.collect_oil_date ? new Date(r.collect_oil_date).toLocaleDateString() : "—"}
                           </span>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Status & Control - Integrated */}
              <div className="flex flex-col lg:items-end gap-8 w-full lg:w-80">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                     r.status === 'completed' ? "text-emerald-500 bg-emerald-500" : r.status === 'pending' ? "text-amber-400 bg-amber-400 animate-pulse" : "text-primary bg-primary"
                   )} />
                   <select 
                      value={r.status}
                      onChange={(e) => updatePressingStatus(r._id, e.target.value)}
                      className="bg-transparent text-[11px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:text-primary transition-all pr-4 border-none appearance-none"
                    >
                      <option value="pending">En attente</option>
                      <option value="accepted">Accepté</option>
                      <option value="completed">Terminé</option>
                      <option value="rejected">Refusé</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full">
                  {dateEditingId === r._id ? (
                    <button onClick={() => updateDates(r._id)} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Confirmer Planning</button>
                  ) : (
                    <button onClick={() => {
                        setDateEditingId(r._id);
                        setTempDates({ bring: r.bring_olives_date?.split('T')[0] || "", collect: r.collect_oil_date?.split('T')[0] || "" });
                    }} className="flex-1 bg-secondary/5 hover:bg-secondary/10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/40 transition-all backdrop-blur-sm">Programmer RDV</button>
                  )}
                  
                  {/* Integrated Blacklist Quick Action */}
                  <button 
                    onClick={() => toggleBlacklist(r.user_id?._id, r._id)}
                    disabled={actionLoadingId === r._id}
                    className={cn(
                      "p-3 rounded-xl transition-all border",
                      r.user_id?.is_blacklisted 
                        ? "bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500 hover:text-white" 
                        : "bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white"
                    )}
                    title={r.user_id?.is_blacklisted ? "Réhabiliter" : "Blacklister"}
                  >
                    {actionLoadingId === r._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      r.user_id?.is_blacklisted ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />
                    )}
                  </button>

                  <button 
                    onClick={() => setEditingNoteId(editingNoteId === r._id ? null : r._id)}
                    className={cn("p-2.5 transition-all text-muted-foreground/30 hover:text-foreground", editingNoteId === r._id && "text-primary")}
                  >
                    <MoreHorizontal className="w-5 h-5 font-light" />
                  </button>
                </div>

                {/* Integrated notes toggle */}
                {editingNoteId === r._id && (
                    <div className="w-full bg-secondary/5 backdrop-blur-xl p-5 rounded-2xl border border-border/40 animate-in fade-in slide-in-from-top-3 duration-500 shadow-xl shadow-black/5">
                      <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">
                         📋 Observation Trituration
                      </div>
                      <textarea
                        value={tempNoteValue}
                        onChange={(e) => setTempNoteValue(e.target.value)}
                        placeholder="..."
                        className="w-full bg-transparent text-xs outline-none font-medium text-foreground/70 placeholder:font-light"
                        rows={3}
                      />
                      <div className="flex justify-end pt-3 border-t border-border/20 mt-3">
                         <button onClick={() => {
                            request(`/pressing/${r._id}/notes`, { method: 'PATCH', body: { notes: tempNoteValue } });
                            setEditingNoteId(null);
                            onRefresh();
                         }} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">Enregistrer</button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredRequests.length === 0 && (
          <div className="py-24 text-center">
            <Factory className="w-12 h-12 text-muted-foreground/10 mx-auto mb-6" />
            <p className="text-sm font-light text-muted-foreground italic">Aucun dossier de pressage trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressingManager;
