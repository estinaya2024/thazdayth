/**
 * PRESSING MANAGER COMPONENT (QUIET LUXURY EDITION)
 * Minimalist and elegant management interface for olive pressing requests.
 * Focuses on effortless scheduling and clean data presentation.
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
  ChevronRight
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
          <h2 className="text-2xl font-light tracking-tight text-foreground/90 uppercase">{isArchived ? "Historique" : "Pressage"}</h2>
          <div className="h-px w-12 bg-primary/40" />
        </div>

        <div className="flex flex-wrap items-center gap-6">
           {/* View filter logic simplified to dots or text links */}
           <div className="flex gap-6 border-b border-transparent">
              <button onClick={() => setViewFilter('all')} className={cn("text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2", viewFilter === 'all' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>Tous</button>
              <button onClick={() => setViewFilter('waitlist')} className={cn("text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2", viewFilter === 'waitlist' ? "border-amber-500 text-amber-600" : "border-transparent text-muted-foreground")}>Sans RDV</button>
              <button onClick={() => setViewFilter('scheduled')} className={cn("text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2", viewFilter === 'scheduled' ? "border-indigo-500 text-indigo-600" : "border-transparent text-muted-foreground")}>Programmés</button>
           </div>

           <div className="relative w-64">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <input
                type="text"
                placeholder="Producteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 py-2 bg-transparent text-sm border-b border-border/50 focus:outline-none focus:border-primary transition-all"
              />
           </div>
        </div>
      </div>

      {/* Aesthetic Rows */}
      <div className="divide-y divide-border/20 px-4">
        {filteredRequests.map(r => (
          <div 
            key={r._id} 
            className={cn(
              "py-12 transition-all group",
              highlightedId === r._id && "bg-primary/[0.01] rounded-3xl px-6"
            )}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-12 items-start">
              {/* Producer & Core Data */}
              <div className="flex-1 space-y-8">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-[9px] font-medium tracking-widest text-muted-foreground opacity-50 uppercase">Réf: {r._id.slice(-6).toUpperCase()}</span>
                     {!r.bring_olives_date && r.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                   </div>
                   <h4 className="text-2xl font-light tracking-tight">{r.user_id?.first_name} {r.user_id?.last_name}</h4>
                   <div className="flex items-center gap-4 text-[11px] text-muted-foreground/60 mt-1">
                      <span>{r.user_id?.phone}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{r.olive_quantity_kg} kg — {r.oil_quality || "Vierge"}</span>
                   </div>
                </div>

                {/* Scheduling logic - Minimalist */}
                <div className="flex flex-wrap gap-8 pt-2">
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Date d'apport</p>
                      {dateEditingId === r._id ? (
                        <input 
                          type="date" 
                          value={tempDates.bring} 
                          onChange={(e) => setTempDates({...tempDates, bring: e.target.value})}
                          className="bg-secondary/20 border-b border-primary/30 outline-none text-xs p-1"
                        />
                      ) : (
                        <p className={cn("text-xs font-semibold", r.bring_olives_date ? "text-foreground" : "text-amber-500 italic")}>
                          {r.bring_olives_date ? new Date(r.bring_olives_date).toLocaleDateString() : "À fixer"}
                        </p>
                      )}
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Date de collecte</p>
                      {dateEditingId === r._id ? (
                        <input 
                          type="date" 
                          value={tempDates.collect} 
                          onChange={(e) => setTempDates({...tempDates, collect: e.target.value})}
                          className="bg-secondary/20 border-b border-primary/30 outline-none text-xs p-1"
                        />
                      ) : (
                        <p className="text-xs font-semibold text-muted-foreground">
                          {r.collect_oil_date ? new Date(r.collect_oil_date).toLocaleDateString() : "—"}
                        </p>
                      )}
                   </div>
                </div>
              </div>

              {/* Status & Control */}
              <div className="flex flex-col lg:items-end gap-6 w-full lg:w-72">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-2 h-2 rounded-full",
                     r.status === 'completed' ? "bg-emerald-500" : r.status === 'pending' ? "bg-amber-400" : "bg-primary"
                   )} />
                   <select 
                      value={r.status}
                      onChange={(e) => updatePressingStatus(r._id, e.target.value)}
                      className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-all pr-4"
                    >
                      <option value="pending">En attente</option>
                      <option value="accepted">Accepté</option>
                      <option value="completed">Terminé</option>
                      <option value="rejected">Refusé</option>
                    </select>
                </div>

                <div className="flex items-center gap-4 w-full">
                  {dateEditingId === r._id ? (
                    <button onClick={() => updateDates(r._id)} className="flex-1 bg-primary text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Valider RDV</button>
                  ) : (
                    <button onClick={() => {
                        setDateEditingId(r._id);
                        setTempDates({ bring: r.bring_olives_date?.split('T')[0] || "", collect: r.collect_oil_date?.split('T')[0] || "" });
                    }} className="flex-1 bg-secondary/30 hover:bg-secondary/50 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-border/20 transition-all">Fixer Dates</button>
                  )}
                  
                  {!isArchived && ['completed', 'rejected'].includes(r.status) && (
                    <button onClick={() => archivePressing(r._id)} className="p-2 text-muted-foreground/30 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Integrated notes toggle */}
                <div className="w-full">
                  <button 
                    onClick={() => setEditingNoteId(editingNoteId === r._id ? null : r._id)}
                    className="text-[10px] font-bold text-muted-foreground/40 hover:text-primary transition-all flex items-center gap-2"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    {r.owner_notes ? "Détails privés" : "Ajouter observation"}
                  </button>
                  {editingNoteId === r._id && (
                    <div className="mt-2 bg-secondary/5 p-4 rounded-xl border border-border/50 animate-in fade-in transition-all">
                      <textarea
                        value={tempNoteValue}
                        onChange={(e) => setTempNoteValue(e.target.value)}
                        placeholder="..."
                        className="w-full bg-transparent text-[10px] outline-none"
                        rows={2}
                      />
                      <button onClick={() => {
                        request(`/pressing/${r._id}/notes`, { method: 'PATCH', body: { notes: tempNoteValue } });
                        setEditingNoteId(null);
                        onRefresh();
                      }} className="text-[9px] font-bold text-primary block text-right mt-1">Enregistrer</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PressingManager;
