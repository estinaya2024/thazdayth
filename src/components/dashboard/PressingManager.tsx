/**
 * PRESSING MANAGER COMPONENT (PROFESSIONAL EDITION)
 * Overhauled to provide a high-end, owner-centric experience for olive pressing management.
 * Features real-time kilogram tracking, scheduling status and advanced organization.
 */

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Factory, 
  Package, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Save,
  Calendar,
  Scale,
  CalendarPlus,
  ArrowRight,
  TrendingDown,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import StatusBtn from "./StatusBtn";
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

  const stats = useMemo(() => {
    const active = pressingRequests.filter(r => r.status !== 'rejected' && r.status !== 'completed');
    const totalKg = active.reduce((sum, r) => sum + (r.olive_quantity_kg || 0), 0);
    const waitlist = active.filter(r => !r.bring_olives_date);
    const todayStr = new Date().toISOString().split('T')[0];
    const bringToday = active.filter(r => r.bring_olives_date?.startsWith(todayStr));

    return {
      activeCount: active.length,
      totalKg,
      waitlistCount: waitlist.length,
      todayCount: bringToday.length
    };
  }, [pressingRequests]);

  const updatePressingStatus = async (id: string, status: string) => {
    try {
      await request(`/pressing/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      toast.success("Statut mis à jour !");
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
      toast.success("Dates fixées !");
      setDateEditingId(null);
      onRefresh();
    } catch (err) {}
  };

  const updateNote = async (id: string, notes: string) => {
    try {
      await request(`/pressing/${id}/notes`, {
        method: 'PATCH',
        body: { notes }
      });
      toast.success("Note mise à jour !");
      setEditingNoteId(null);
      onRefresh();
    } catch (err) {}
  };

  const archivePressing = async (id: string) => {
    try {
      await request(`/pressing/${id}/archive`, { method: 'PATCH' });
      toast.success("Archive sauvegardée !");
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
    }).sort((a, b) => {
      // Sort by bring date if exists, otherwise by creation date
      if (a.bring_olives_date && b.bring_olives_date) return new Date(a.bring_olives_date).getTime() - new Date(b.bring_olives_date).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [pressingRequests, searchTerm, statusFilter, viewFilter]);

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Specialized Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">{isArchived ? "Historique des Triturations" : "Gestion du Pressage"}</h2>
          <p className="text-sm text-muted-foreground font-medium">Planifiez les apports et suivez la production d'huile en temps réel.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Chercher un producteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-secondary/30 border-2 border-transparent focus:border-primary/20 rounded-[2rem] text-sm focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. Weight & Schedule Stats */}
      {!isArchived && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {[
            { label: "Volume en attente (kg)", value: stats.totalKg.toLocaleString(), icon: Scale, color: "text-primary", bg: "bg-primary/10" },
            { label: "À planifier", value: stats.waitlistCount, icon: CalendarPlus, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Apports Aujourd'hui", value: stats.todayCount, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { label: "Capacité Active", value: stats.activeCount, icon: TrendingDown, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border/50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", s.bg, s.color)}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-black mt-1 leading-none">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Organization Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex overflow-x-auto gap-3 scrollbar-none">
          {['all', 'pending', 'accepted', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-primary text-white border-primary shadow-lg"
                  : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
              )}
            >
              {status === 'all' ? 'Tous les statuts' : status}
            </button>
          ))}
        </div>

        <div className="bg-secondary/20 p-1 rounded-2xl flex gap-1 border border-border/30">
          <button onClick={() => setViewFilter('all')} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all", viewFilter === 'all' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}>Tous</button>
          <button onClick={() => setViewFilter('waitlist')} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all", viewFilter === 'waitlist' ? "bg-background shadow-sm text-amber-600" : "text-muted-foreground hover:text-foreground")}>Waitlist</button>
          <button onClick={() => setViewFilter('scheduled')} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all", viewFilter === 'scheduled' ? "bg-background shadow-sm text-indigo-600" : "text-muted-foreground hover:text-foreground")}>Programmés</button>
        </div>
      </div>

      {/* 4. Luxury Pressing List */}
      <div className="grid gap-6 px-2">
        {filteredRequests.map(r => (
          <div 
            key={r._id} 
            id={`pressing-${r._id}`}
            className={cn(
              "group bg-card border-2 p-8 rounded-[3.5rem] transition-all duration-300 relative overflow-hidden",
              highlightedId === r._id 
                ? "border-primary ring-8 ring-primary/5 shadow-2xl scale-[1.02] z-10" 
                : "border-border/50 hover:border-primary/20 hover:shadow-xl"
            )}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-10">
              {/* Producer Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full">#{r._id.slice(-6).toUpperCase()}</span>
                    {!r.bring_olives_date && r.status !== 'rejected' && r.status !== 'completed' && (
                      <span className="animate-pulse px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                        🚨 Needs Date
                      </span>
                    )}
                  </div>
                  <h4 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    {r.user_id?.first_name} {r.user_id?.last_name}
                    {r.user_id?.is_blacklisted && (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase shadow-sm">⚠️ Blacklist</span>
                    )}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                     <a href={`tel:${r.user_id?.phone}`} className="text-sm font-black text-primary hover:underline">{r.user_id?.phone}</a>
                     <span className="text-xs text-muted-foreground font-bold">{r.user_id?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantité d'olives</p>
                      <p className="text-xl font-black text-primary leading-none mt-1">{r.olive_quantity_kg.toLocaleString()} kg</p>
                    </div>
                  </div>
                  <div className="bg-secondary/20 p-6 rounded-[2.5rem] border border-border/30 flex items-center gap-4">
                    <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-muted-foreground">
                      <Factory className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variété/Qualité</p>
                      <p className="text-sm font-black leading-none mt-1">{r.oil_quality || "Standard"}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Notes */}
                <div className="pt-2">
                  {editingNoteId === r._id ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempNoteValue}
                        onChange={(e) => setTempNoteValue(e.target.value)}
                        autoFocus
                        className="w-full bg-background border-2 border-primary/20 rounded-2xl p-4 text-xs font-medium outline-none shadow-inner"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => updateNote(r._id, tempNoteValue)} className="flex-1 bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Enregistrer Note</button>
                        <button onClick={() => setEditingNoteId(null)} className="px-6 py-2 rounded-xl bg-secondary text-[10px] font-black uppercase tracking-widest">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => { setEditingNoteId(r._id); setTempNoteValue(r.owner_notes || ""); }}
                      className="p-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 border-2 border-dashed border-border/50 text-[10px] text-muted-foreground font-bold italic cursor-pointer transition-all flex items-center gap-2"
                    >
                      {r.owner_notes ? `🗒️ "${r.owner_notes}"` : "+ Note privée (ex: État des caisses, maturité...)"}
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling Column */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-secondary/10 rounded-[2.5rem] p-6 border border-border/30 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calendrier</span>
                    <button 
                      onClick={() => {
                        setDateEditingId(r._id);
                        setTempDates({ bring: r.bring_olives_date?.split('T')[0] || "", collect: r.collect_oil_date?.split('T')[0] || "" });
                      }}
                      className="text-[9px] font-black text-primary hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" /> {r.bring_olives_date ? "Modifier" : "Fixer un RDV"}
                    </button>
                  </div>

                  {dateEditingId === r._id ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5" /> Date d'apport</label>
                        <input type="date" value={tempDates.bring} onChange={(e) => setTempDates({...tempDates, bring: e.target.value})} className="w-full bg-background border rounded-xl p-2.5 text-xs font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5" /> Date de collecte</label>
                        <input type="date" value={tempDates.collect} onChange={(e) => setTempDates({...tempDates, collect: e.target.value})} className="w-full bg-background border rounded-xl p-2.5 text-xs font-bold" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateDates(r._id)} className="flex-1 bg-indigo-600 text-white p-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">Valider</button>
                        <button onClick={() => setDateEditingId(null)} className="px-4 p-2.5 bg-secondary rounded-xl text-[9px] font-black uppercase">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 tracking-widest"><div className="w-1 h-1 rounded-full bg-primary" /> Apport des olives</span>
                        <span className={cn("text-sm font-black tracking-tight", r.bring_olives_date ? "text-foreground" : "text-amber-500 italic")}>
                          {r.bring_olives_date ? new Date(r.bring_olives_date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) : "Non planifié"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 tracking-widest"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Retrait de l'huile</span>
                        <span className={cn("text-sm font-black tracking-tight", r.collect_oil_date ? "text-foreground" : "text-muted-foreground italic")}>
                          {r.collect_oil_date ? new Date(r.collect_oil_date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) : "Attendu..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Actions sur le statut</p>
                  <div className="grid grid-cols-2 gap-2">
                    {r.status === 'pending' && (
                       <button onClick={() => updatePressingStatus(r._id, 'accepted')} className="col-span-2 bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                        <CheckCircle2 className="w-4 h-4" /> Accepter & Confirmer
                      </button>
                    )}
                    {(r.status === 'pending' || r.status === 'accepted') && (
                       <button onClick={() => updatePressingStatus(r._id, 'completed')} className="col-span-2 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                        <Package className="w-4 h-4" /> Trituration Terminée
                      </button>
                    )}
                    {!isArchived && ['completed', 'rejected'].includes(r.status) && (
                      <button onClick={() => archivePressing(r._id)} className="col-span-2 bg-secondary text-muted-foreground p-3 rounded-2xl border border-border/50 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" /> Archiver
                      </button>
                    )}
                    {!isArchived && (r.status === 'pending') && (
                      <button onClick={() => updatePressingStatus(r._id, 'rejected')} className="col-span-2 bg-red-500/5 text-red-500 border-2 border-red-500/10 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                        Refuser la demande
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-32 bg-secondary/10 border-4 border-dashed border-border/50 rounded-[4rem]">
            <div className="w-20 h-20 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Factory className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-black text-muted-foreground tracking-tight">Aucun dossier de pressage trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressingManager;
