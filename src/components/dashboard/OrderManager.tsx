/**
 * ORDER MANAGER COMPONENT (QUIET LUXURY EDITION)
 * Designed for effortless elegance, prioritizing clarity, whitespace, and premium minimalism.
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
  MoreHorizontal
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
          <div className="h-px w-12 bg-primary/40" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-4 py-2 border-b border-border/50 bg-transparent text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-secondary/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none border border-transparent hover:border-border transition-all cursor-pointer"
          >
            <option value="all">Tous les Statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Prêt</option>
            <option value="delivered">Terminé</option>
          </select>
        </div>
      </div>

      {/* Elegant minimalist rows */}
      <div className="divide-y divide-border/30 px-4">
        {filteredOrders.map(o => (
          <div 
            key={o._id} 
            id={`order-${o._id}`}
            className={cn(
              "py-10 transition-all group",
              highlightedId === o._id && "bg-primary/[0.02] ring-1 ring-primary/10 rounded-3xl px-6"
            )}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-10 items-start">
              {/* Profile & Info */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-medium tracking-widest text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded uppercase">Ref: {o._id.slice(-6).toUpperCase()}</span>
                    {o.user_id?.is_blacklisted && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Blacklisté" />}
                  </div>
                  <h4 className="text-xl font-light tracking-tight">{o.user_id?.first_name} {o.user_id?.last_name}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground/70">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {o.user_id?.phone}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {o.shipping?.type === 'delivery' ? (o.shipping.wilaya || "Livraison") : "Retrait"}</span>
                  </div>
                </div>

                {/* Items Summary - Simplified */}
                <div className="flex flex-wrap gap-2">
                  {o.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-secondary/10 px-3 py-1.5 rounded-full border border-border/50 flex items-center gap-3">
                      <span className="text-[10px] font-medium text-foreground/80">{item.olive_category_id?.name || "Produit"}</span>
                      <span className="text-[9px] font-bold text-primary">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Actions - Integrated */}
              <div className="flex flex-col lg:items-end gap-6 w-full lg:w-80">
                <div className="flex flex-col lg:items-end">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 mb-1">Montant</span>
                  <span className="text-2xl font-light tracking-tighter text-foreground">{o.total_price.toLocaleString()} DA</span>
                </div>

                <div className="w-full flex items-center justify-between lg:justify-end gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      o.status === 'delivered' ? "bg-emerald-400" : o.status === 'pending' ? "bg-amber-400" : "bg-primary"
                    )} />
                    <select 
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-all pr-4"
                    >
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Prêt</option>
                      <option value="delivered">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {['delivered', 'cancelled', 'completed'].includes(o.status) && !isArchived && (
                      <button onClick={() => archiveOrder(o._id)} className="p-2 text-muted-foreground/30 hover:text-red-500 transition-all" title="Archiver">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingNoteId(editingNoteId === o._id ? null : o._id)}
                      className={cn("p-2 transition-all", editingNoteId === o._id ? "text-primary bg-primary/5 rounded-full" : "text-muted-foreground/30 hover:text-foreground")}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtile expandable note */}
                {editingNoteId === o._id && (
                  <div className="w-full bg-secondary/5 p-4 rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                      value={tempNoteValue}
                      onChange={(e) => setTempNoteValue(e.target.value)}
                      autoFocus
                      placeholder="Ajouter une observation..."
                      className="w-full bg-transparent text-[11px] outline-none resize-none placeholder:italic"
                      rows={2}
                    />
                    <div className="flex justify-end pt-2">
                       <button onClick={() => updateNote(o._id, tempNoteValue)} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Sauvegarder</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-muted-foreground italic">Aucune commande ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
