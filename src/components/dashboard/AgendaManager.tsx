/**
 * AGENDA MANAGER COMPONENT
 * Handles viewing and scheduling for both orders (pickups/deliveries) and pressing requests.
 */

import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Trash2, 
  Save, 
  Calendar, 
  Users as UsersIcon 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

interface AgendaManagerProps {
  orders: any[];
  pressingRequests: any[];
  allUsers: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setActiveTab: (tab: any) => void;
  onRefresh: () => void;
  view: "all" | "pressing" | "contacts";
}

const AgendaManager: React.FC<AgendaManagerProps> = ({
  orders,
  pressingRequests,
  allUsers,
  searchTerm,
  setSearchTerm,
  setActiveTab,
  onRefresh,
  view
}) => {
  const { t } = useTranslation();
  const { request } = useApi();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteValue, setTempNoteValue] = useState("");

  const updateNote = async (id: string, type: 'order' | 'pressing', notes: string) => {
    try {
      const endpoint = type === 'order' ? `/orders/${id}/notes` : `/pressing/${id}/notes`;
      await request(endpoint, {
        method: 'PATCH',
        body: { notes }
      });
      toast.success("Note mise à jour !");
      setEditingNoteId(null);
      onRefresh();
    } catch (err) {}
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await request(`/orders/${id}`, { method: 'DELETE' });
      toast.success("Supprimé !");
      onRefresh();
    } catch (err) {}
  };

  const deletePressing = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    try {
      await request(`/pressing/${id}`, { method: 'DELETE' });
      toast.success("Supprimé !");
      onRefresh();
    } catch (err) {}
  };

  // Process agenda items
  const agendaOrders = [
    ...orders.filter(o => o.shipping?.type === 'pickup' && o.shipping.pickup_range_start).map(o => ({
      ...o,
      agendaType: 'pickup',
      agendaDate: o.shipping.pickup_range_start
    })),
    ...orders.filter(o => o.shipping?.type === 'delivery').map(o => ({
      ...o,
      agendaType: 'delivery',
      agendaDate: o.created_at
    }))
  ].filter(item => {
    const searchStr = `${item._id} ${item.tracking_code || ''} ${item.user_id?.first_name} ${item.user_id?.last_name} ${item.user_id?.phone} ${item.user_id?.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(a.agendaDate).getTime() - new Date(b.agendaDate).getTime());

  const agendaPressing = pressingRequests.filter(r => r.bring_olives_date || r.collect_oil_date).filter(item => {
    const searchStr = `${item._id} ${item.user_id?.first_name} ${item.user_id?.last_name} ${item.user_id?.phone} ${item.user_id?.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-primary" />
          {t("dashboard.agenda.title")}
        </h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("dashboard.agenda.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-12">
        {/* Deliveries & Pickups */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-muted-foreground/80">
            <Truck className="w-5 h-5" />
            {t("dashboard.agenda.pickups")}
          </h3>
          <div className="grid gap-4">
            {agendaOrders.map((item, idx) => (
              <div key={`order-${idx}`} className="bg-card border p-5 rounded-[28px] hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.agendaType === 'pickup' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {item.agendaType === 'pickup' ? <MapPin className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold underline cursor-pointer hover:text-primary transition-all" onClick={() => {
                        setActiveTab('orders');
                        setSearchTerm(item._id);
                      }}>
                        {item.user_id?.first_name} {item.user_id?.last_name}
                      </h4>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                        {item.agendaType === 'pickup' ? 'RETRAIT' : 'LIVRAISON'} #{item.tracking_code || item._id.slice(-6).toUpperCase()}
                      </p>
                      <div className="flex gap-3 mt-1 text-[11px]">
                        <span className="font-bold text-primary flex items-center gap-1"><Phone className="w-3 h-3" /> {item.user_id?.phone}</span>
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.agendaDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteOrder(item._id)} className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    <button onClick={() => { setActiveTab('orders'); setSearchTerm(item._id); }} className="p-2 rounded-full hover:bg-secondary transition-colors"><ChevronRight className="w-5 h-5 text-muted-foreground" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pressing Agenda */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-muted-foreground/80">
            <Calendar className="w-5 h-5" />
            Agenda du Pressage
          </h3>
          <div className="grid gap-4">
            {agendaPressing.map((item, idx) => (
              <div key={`press-${idx}`} className="bg-card border p-5 rounded-[28px] hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold underline cursor-pointer hover:text-primary transition-all" onClick={() => {
                        setActiveTab('pressing');
                        setSearchTerm(item._id);
                      }}>
                        {item.user_id?.first_name} {item.user_id?.last_name}
                      </h4>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">PRESSAGE #{item._id.slice(-6).toUpperCase()}</p>
                      <div className="flex gap-3 mt-1 text-[11px]">
                        <span className="font-bold text-primary flex items-center gap-1"><Phone className="w-3 h-3" /> {item.user_id?.phone}</span>
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Apport: {item.bring_olives_date ? new Date(item.bring_olives_date).toLocaleDateString() : 'Non fixé'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => deletePressing(item._id)} className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    <button onClick={() => { setActiveTab('pressing'); setSearchTerm(item._id); }} className="p-2 rounded-full hover:bg-secondary transition-colors"><ChevronRight className="w-5 h-5 text-muted-foreground" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaManager;
