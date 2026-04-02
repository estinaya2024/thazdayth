/**
 * ORDER MANAGER COMPONENT
 * Handles filtering, status updates, and note-taking for customer orders.
 */

import React, { useState } from "react";
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
  Edit2, 
  Save 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import StatusBtn from "./StatusBtn";

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
      toast.success("Confirmé !");
      onRefresh();
    } catch (err) {}
  };

  const filteredOrders = orders.filter(o => {
    const searchStr = `${o._id} ${o.tracking_code || ''} ${o.user_id?.first_name} ${o.user_id?.last_name} ${o.user_id?.phone} ${o.user_id?.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <h2 className="text-2xl font-bold">Suivi des Commandes</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map(o => (
          <div 
            key={o._id} 
            id={`order-${o._id}`}
            className={`bg-secondary/30 border p-6 rounded-3xl group transition-all ${highlightedId === o._id ? 'ring-2 ring-primary border-primary shadow-lg scale-[1.01]' : 'border-border'}`}
          >
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Ref: #{o._id.slice(-6).toUpperCase()}</p>
                <h4 className="font-bold text-lg flex items-center gap-2">
                  {o.user_id?.first_name} {o.user_id?.last_name}
                  {o.user_id?.is_blacklisted && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase">
                      Blacklist
                    </span>
                  )}
                </h4>
                <div className="text-[11px] text-muted-foreground bg-background/50 p-3 rounded-2xl mt-1 space-y-2 border border-border/10">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-primary" />
                    <span>{o.user_id?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <a href={`tel:${o.user_id?.phone}`} className="hover:underline font-bold transition-all">{o.user_id?.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{o.shipping?.type === 'delivery' ? (o.shipping.wilaya || o.user_id?.address) : "Point de collecte"}</span>
                  </div>
                </div>

                {/* Items list */}
                <div className="mt-4 pt-4 border-t border-border/10 space-y-1">
                  {o.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-muted-foreground flex items-center gap-1.5 text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                        <Package className="w-3 h-3 text-primary" />
                        {item.olive_category_id?.name || item.pressing_service_id?.name || "Produit"}
                      </span>
                      <span className="bg-secondary/50 px-2 py-0.5 rounded-md font-black text-primary">
                        x{item.quantity}{item.model_type === 'Product' || item.model_type === 'OliveCategory' ? 'L' : 'kg'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Note section */}
                <div className="mt-4">
                  {editingNoteId === o._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={tempNoteValue}
                        onChange={(e) => setTempNoteValue(e.target.value)}
                        autoFocus
                        className="w-full bg-background border border-indigo-500/30 rounded-xl p-3 text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingNoteId(null)} className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold">Annuler</button>
                        <button onClick={() => updateNote(o._id, tempNoteValue)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Enregistrer</button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setEditingNoteId(o._id);
                        setTempNoteValue(o.owner_notes || "");
                      }}
                      className="p-2 rounded-xl cursor-pointer hover:bg-secondary/20 border border-dashed border-border/50 text-[10px] text-muted-foreground italic h-8 flex items-center"
                    >
                      {o.owner_notes ? `Note: "${o.owner_notes}"` : "+ Ajouter une note privée..."}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-sm 
                  ${o.status === 'completed' || o.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                  o.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                  {o.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <p className="text-sm font-medium">Total: <span className="text-primary font-bold">{o.total_price.toLocaleString()} DA</span></p>
              <div className="flex gap-2 flex-wrap justify-end">
                {o.shipping?.type === 'pickup' && o.shipping.pickup_status === 'accepted' && (
                  <StatusBtn onClick={() => markOrderAsCollected(o._id)} icon={Package} label="Marquer Récupéré" color="text-green-600" />
                )}
                {o.status === 'pending' && <StatusBtn onClick={() => updateOrderStatus(o._id, 'in-progress')} icon={Clock} label="En cours" color="text-blue-500" />}
                {(o.status === 'pending' || o.status === 'in-progress') && <StatusBtn onClick={() => updateOrderStatus(o._id, 'delivered')} icon={CheckCircle2} label="Livré" color="text-green-500" />}
                {!isArchived && ['delivered', 'cancelled', 'completed'].includes(o.status) && <StatusBtn onClick={() => archiveOrder(o._id)} icon={Trash2} label="Archiver" color="text-muted-foreground" />}
                {!isArchived && <StatusBtn onClick={() => updateOrderStatus(o._id, 'cancelled')} icon={XCircle} label="Annuler" color="text-red-500" />}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune commande trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
