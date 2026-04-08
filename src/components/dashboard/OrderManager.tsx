/**
 * ORDER MANAGER COMPONENT (PROFESSIONAL EDITION)
 * Overhauled to provide a high-end, owner-centric experience with real-time stats and advanced filtering.
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
  Filter,
  TrendingUp,
  CreditCard,
  Truck,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import StatusBtn from "./StatusBtn";
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

  // Statistics Calculation
  const stats = useMemo(() => {
    const active = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered');
    const pending = orders.filter(o => o.status === 'pending');
    const today = new Date().setHours(0,0,0,0);
    const deliveriesToday = orders.filter(o => {
      const d = new Date(o.shipping?.pickup_range_start || o.created_at).setHours(0,0,0,0);
      return d === today && o.status !== 'delivered';
    });
    const revenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

    return {
      activeCount: active.length,
      pendingCount: pending.length,
      todayCount: deliveriesToday.length,
      totalRevenue: revenue
    };
  }, [orders]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      toast.success("Statut mis à jour !");
      onRefresh();
    } catch (err) {}
  };

  const updateNote = async (id: string, notes: string) => {
    try {
      await request(`/orders/${id}/notes`, {
        method: 'PATCH',
        body: { notes }
      });
      toast.success("Note mise à jour !");
      setEditingNoteId(null);
      onRefresh();
    } catch (err) {}
  };

  const archiveOrder = async (id: string) => {
    try {
      await request(`/orders/${id}/archive`, { method: 'PATCH' });
      toast.success("Commande archivée !");
      onRefresh();
    } catch (err) {}
  };

  const markOrderAsCollected = async (id: string) => {
    try {
      await request(`/orders/${id}/pickup/collect`, { method: 'PATCH' });
      toast.success("Collecte confirmée !");
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
    <div className="space-y-10 pb-20">
      {/* 1. Header & Quick Filtering */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">{isArchived ? "Archives des Commandes" : "Gestion des Commandes"}</h2>
          <p className="text-sm text-muted-foreground font-medium">Suivez, traitez et gérez les ventes de votre moulin.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Nom, Tel ou N° commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-secondary/30 border-2 border-transparent focus:border-primary/20 rounded-[2rem] text-sm focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. Professional Stats Bar */}
      {!isArchived && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {[
            { label: "En Attente", value: stats.pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Actives Total", value: stats.activeCount, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
            { label: "À traiter aujourd'hui", value: stats.todayCount, icon: MapPin, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { label: "CA Total (DA)", value: stats.totalRevenue.toLocaleString(), icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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

      {/* 3. Filter Tabs */}
      <div className="flex overflow-x-auto gap-3 px-2 scrollbar-none">
        {['all', 'pending', 'in-progress', 'completed', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all whitespace-nowrap",
              statusFilter === status 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
            )}
          >
            {status === 'all' ? 'Toutes' : status}
          </button>
        ))}
      </div>

      {/* 4. Luxury Order List */}
      <div className="grid gap-6 px-2">
        {filteredOrders.map(o => (
          <div 
            key={o._id} 
            id={`order-${o._id}`}
            className={cn(
              "group bg-card border-2 p-8 rounded-[3.5rem] transition-all duration-300 relative overflow-hidden",
              highlightedId === o._id 
                ? "border-primary ring-8 ring-primary/5 shadow-2xl scale-[1.02] z-10" 
                : "border-border/50 hover:border-primary/20 hover:shadow-xl"
            )}
          >
            {/* Status Background Accent */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-colors",
              o.status === 'delivered' ? "bg-emerald-500" : o.status === 'pending' ? "bg-amber-500" : "bg-primary"
            )} />

            <div className="flex flex-col lg:flex-row justify-between gap-8 items-start">
              {/* Left Column: Client & Items */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full">#{o._id.slice(-6).toUpperCase()}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                      o.shipping?.type === 'delivery' ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    )}>
                      {o.shipping?.type === 'delivery' ? <div className="flex items-center gap-1"><Truck className="w-3 h-3" /> Livraison</div> : <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Point de retrait</div>}
                    </span>
                  </div>
                  <h4 className="text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors flex items-center gap-3">
                    {o.user_id?.first_name} {o.user_id?.last_name}
                    {o.user_id?.is_blacklisted && (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase shadow-sm">
                        ⚠️ Blacklisté
                      </span>
                    )}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-5 rounded-[2.5rem] border border-border/30 space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2"><UserIcon className="w-3 h-3" /> Coordonnées</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/50 text-primary">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <a href={`tel:${o.user_id?.phone}`} className="text-sm font-black hover:text-primary transition-all tracking-tight">{o.user_id?.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/50 text-primary">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground truncate max-w-[200px]">{o.shipping?.type === 'delivery' ? (o.shipping.wilaya || o.user_id?.address) : "Retrait au moulin"}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/20 p-5 rounded-[2.5rem] border border-border/30 space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2"><Package className="w-3 h-3" /> Contenu du colis</p>
                    <div className="space-y-2">
                      {o.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-background/50 px-4 py-2 rounded-2xl border border-border/20">
                          <span className="text-xs font-bold text-foreground overflow-hidden whitespace-nowrap text-ellipsis max-w-[150px]">
                            {item.olive_category_id?.name || item.pressing_service_id?.name || "Produit"}
                          </span>
                          <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/20">
                             x{item.quantity}{item.model_type === 'Product' || item.model_type === 'OliveCategory' ? 'L' : 'kg'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Pricing */}
              <div className="w-full lg:w-72 flex flex-col gap-6 lg:items-end">
                <div className="text-left lg:text-right space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Montant de la commande</p>
                  <p className="text-4xl font-black text-primary leading-none tracking-tighter">{o.total_price.toLocaleString()} DA</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pt-2">
                    {new Date(o.created_at).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <div className="relative group/select">
                    <select 
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className={cn(
                        "w-full appearance-none bg-background border-2 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer",
                        o.status === 'delivered' ? "border-emerald-500 text-emerald-600" : "border-border/50"
                      )}
                    >
                      <option value="pending">⏳ En attente</option>
                      <option value="in-progress">⚙️ En cours</option>
                      <option value="completed">✅ Prêt</option>
                      <option value="delivered">📦 Livré</option>
                      <option value="cancelled">❌ Annulé</option>
                    </select>
                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-30 group-hover/select:translate-x-1 transition-transform" />
                  </div>

                  <div className="flex gap-2">
                    {o.shipping?.type === 'pickup' && o.shipping.pickup_status === 'accepted' && (
                      <button onClick={() => markOrderAsCollected(o._id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" /> Collecté
                      </button>
                    )}
                    {!isArchived && ['delivered', 'cancelled', 'completed'].includes(o.status) && (
                      <button onClick={() => archiveOrder(o._id)} className="bg-secondary hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all border border-border/50 group/arch">
                        <Trash2 className="w-5 h-5 group-hover/arch:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Private Notes Enhanced */}
                <div className="w-full">
                  {editingNoteId === o._id ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempNoteValue}
                        onChange={(e) => setTempNoteValue(e.target.value)}
                        autoFocus
                        placeholder="Info confidentielle sur le client..."
                        className="w-full bg-background border-2 border-indigo-500/20 rounded-2xl p-4 text-[11px] font-medium outline-none shadow-inner"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingNoteId(null)} className="px-4 py-2 rounded-xl bg-secondary text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-500/10 hover:text-red-600">Annuler</button>
                        <button onClick={() => updateNote(o._id, tempNoteValue)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                          <Save className="w-3.5 h-3.5" /> Sauver
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setEditingNoteId(o._id);
                        setTempNoteValue(o.owner_notes || "");
                      }}
                      className="group/note p-4 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-dashed border-indigo-500/20 text-[10px] font-bold text-indigo-600 italic cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      {o.owner_notes ? `🗒️ "${o.owner_notes}"` : "+ Ajouter une note confidentielle..."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-32 bg-secondary/10 border-4 border-dashed border-border/50 rounded-[4rem]">
            <div className="w-20 h-20 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-black text-muted-foreground tracking-tight">Aucun résultat ne correspond à vos filtres.</p>
            <button onClick={() => { setStatusFilter('all'); setSearchTerm(''); }} className="mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline">Réinitialiser les filtres</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
