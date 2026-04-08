/**
 * ORDER MANAGER COMPONENT (PREMIUM RICH EDITION)
 * Evolved with luxurious depth, glassmorphism, and integrated blacklist controls.
 * Features ultra-clean layouts and micro-interactions for an effortless owner experience.
 */

import React, { useState, useMemo } from "react";
import { 
  Search, 
  ShoppingBag, 
  Package, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Save,
  ArrowRight,
  Truck,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

interface OrderManagerProps {
  orders: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  highlightedId: string | null;
  onRefresh: () => void;
  isArchived?: boolean;
}

const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
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
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      toast.success("Statut mis à jour");
      onRefresh();
    } catch (err) {}
  };

  const toggleBlacklist = async (userId: string, orderId: string) => {
    if (!userId) return;
    setActionLoadingId(orderId);
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

  const updateNote = async (id: string, notes: string) => {
    try {
      await request(`/orders/${id}/notes`, {
        method: 'PATCH',
        body: { notes }
      });
      toast.success("Note enregistrée");
      setEditingNoteId(null);
      onRefresh();
    } catch (err) {}
  };

  const archiveOrder = async (id: string) => {
    try {
      await request(`/orders/${id}/archive`, { method: 'PATCH' });
      toast.success("Commande archivée");
      onRefresh();
    } catch (err) {}
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const searchStr = `${o._id} ${o.tracking_code || ''} ${o.user_id?.first_name} ${o.user_id?.last_name} ${o.user_id?.phone} ${o.user_id?.email}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-12">
      {/* Search & Minimalist Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight text-foreground/90 uppercase">{isArchived ? "Archives" : "Commandes"}</h2>
          <div className="h-px w-12 bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-4 py-2 border-b border-border/50 bg-transparent text-sm focus:outline-none focus:border-primary transition-all font-light"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-secondary/10 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none border border-transparent hover:border-border/50 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">Tous les Statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Prêt</option>
            <option value="delivered">Terminé</option>
          </select>
        </div>
      </div>

      {/* Elegant Glass Rows */}
      <div className="divide-y divide-border/20 px-4">
        {filteredOrders.map(o => (
          <div 
            key={o._id} 
            id={`order-${o._id}`}
            className={cn(
              "py-10 transition-all group relative overflow-hidden",
              highlightedId === o._id && "bg-primary/[0.02] ring-1 ring-primary/10 rounded-3xl px-6",
              o.user_id?.is_blacklisted && "opacity-70 grayscale-[0.3]"
            )}
          >
            {/* Glass Hover Backdrop */}
            <div className="absolute inset-x-0 inset-y-1 bg-gradient-to-r from-primary/[0.01] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none backdrop-blur-[1px]" />

            <div className="flex flex-col lg:flex-row justify-between gap-10 items-start relative z-10">
              {/* Profile & Info */}
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 bg-secondary/30 px-2 py-0.5 rounded uppercase border border-border/20">Ref: {o._id.slice(-6).toUpperCase()}</span>
                    {o.user_id?.is_blacklisted && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-tighter">
                         <ShieldAlert className="w-3 h-3" /> Utilisateur Blacklisté
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-light tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{o.user_id?.first_name} {o.user_id?.last_name}</h4>
                  <div className="flex flex-wrap items-center gap-5 text-[11px] text-muted-foreground/50 font-medium">
                    <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 opacity-40" /> {o.user_id?.phone}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 opacity-40" /> {o.shipping?.type === 'delivery' ? (o.shipping.wilaya || "Livraison") : "Retrait au moulin"}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-2 font-bold text-primary/60"><Clock className="w-3.5 h-3.5" /> {new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Items Summary - Luxurious Capsules */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {o.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-background/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/30 flex items-center gap-4 shadow-sm hover:border-primary/20 transition-all group/item">
                      <span className="text-[10px] font-bold tracking-tight text-foreground/70 group-hover/item:text-primary transition-colors">{item.olive_category_id?.name || item.name || "Produit"}</span>
                      <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Actions - Premium Depth */}
              <div className="flex flex-col lg:items-end gap-8 w-full lg:w-80">
                <div className="flex flex-col lg:items-end">
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/30 mb-1">Total Commande</span>
                  <span className="text-3xl font-light tracking-tighter text-foreground drop-shadow-sm">{o.total_price.toLocaleString()} DA</span>
                </div>

                <div className="w-full flex items-center justify-between lg:justify-end gap-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                      o.status === 'delivered' ? "text-emerald-500 bg-emerald-500" : o.status === 'pending' ? "text-amber-400 bg-amber-400 animate-pulse" : "text-primary bg-primary"
                    )} />
                    <select 
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className="bg-transparent text-[11px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:text-primary transition-all pr-4 border-none appearance-none"
                    >
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Prêt</option>
                      <option value="delivered">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    {['delivered', 'cancelled', 'completed'].includes(o.status) && !isArchived && (
                      <button onClick={() => archiveOrder(o._id)} className="p-2.5 text-muted-foreground/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10 rounded-xl" title="Archiver">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Integrated Blacklist Quick Action */}
                    <button 
                      onClick={() => toggleBlacklist(o.user_id?._id, o._id)}
                      disabled={actionLoadingId === o._id}
                      className={cn(
                        "p-2.5 rounded-xl transition-all border",
                        o.user_id?.is_blacklisted 
                          ? "bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500 hover:text-white" 
                          : "bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white"
                      )}
                      title={o.user_id?.is_blacklisted ? "Réhabiliter l'utilisateur" : "Blacklister l'utilisateur"}
                    >
                      {actionLoadingId === o._id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        o.user_id?.is_blacklisted ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />
                      )}
                    </button>

                    <button 
                      onClick={() => setEditingNoteId(editingNoteId === o._id ? null : o._id)}
                      className={cn("p-2.5 transition-all text-muted-foreground/30 hover:text-foreground", editingNoteId === o._id && "text-primary")}
                    >
                      <MoreHorizontal className="w-5 h-5 font-light" />
                    </button>
                  </div>
                </div>

                {/* Glass Note Expandable */}
                {editingNoteId === o._id && (
                  <div className="w-full bg-secondary/5 backdrop-blur-xl p-5 rounded-2xl border border-border/40 animate-in fade-in slide-in-from-top-3 duration-500 shadow-xl shadow-black/5">
                    <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">
                       🗒️ Observation Privée
                    </div>
                    <textarea
                      value={tempNoteValue}
                      onChange={(e) => setTempNoteValue(e.target.value)}
                      autoFocus
                      placeholder="..."
                      className="w-full bg-transparent text-xs outline-none font-medium text-foreground/70 placeholder:font-light"
                      rows={3}
                    />
                    <div className="flex justify-end pt-3 border-t border-border/20 mt-3">
                       <button onClick={() => updateNote(o._id, tempNoteValue)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">Enregistrer</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManager;
