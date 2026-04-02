/**
 * PRESSING MANAGER COMPONENT
 * Handles managing customer requests for olive oil pressing.
 */

import React, { useState } from "react";
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
  Edit2, 
  Save 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import StatusBtn from "./StatusBtn";

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
      toast.success("Demande archivée !");
      onRefresh();
    } catch (err) {}
  };

  const filteredRequests = pressingRequests.filter(r => {
    const searchStr = `${r._id} ${r.user_id?.first_name} ${r.user_id?.last_name} ${r.user_id?.phone} ${r.user_id?.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <h2 className="text-2xl font-bold">Demandes de Pressage</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map(r => (
          <div 
            key={r._id} 
            id={`pressing-${r._id}`}
            className={`bg-secondary/30 border p-6 rounded-3xl group transition-all ${highlightedId === r._id ? 'ring-2 ring-primary border-primary shadow-lg scale-[1.01]' : 'border-border'}`}
          >
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h4 className="font-bold text-lg flex items-center gap-2">
                  {r.user_id?.first_name} {r.user_id?.last_name}
                  {r.user_id?.is_blacklisted && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase">
                      Blacklist
                    </span>
                  )}
                </h4>
                <div className="text-[11px] text-muted-foreground bg-background/50 p-3 rounded-2xl mt-2 space-y-2 border border-border/10">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-primary" />
                    <span>{r.user_id?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    <a href={`tel:${r.user_id?.phone}`} className="hover:underline font-bold transition-all">{r.user_id?.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{r.user_id?.address || "Kabylie"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Package className="w-4 h-4 text-primary" />
                  <p className="text-sm font-bold">{r.olive_quantity_kg} kg <span className="text-xs text-muted-foreground font-normal">({r.oil_quality})</span></p>
                </div>

                {/* Note section */}
                <div className="mt-4">
                  {editingNoteId === r._id ? (
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
                        <button onClick={() => updateNote(r._id, tempNoteValue)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Enregistrer</button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setEditingNoteId(r._id);
                        setTempNoteValue(r.owner_notes || "");
                      }}
                      className="p-2 rounded-xl cursor-pointer hover:bg-secondary/20 border border-dashed border-border/50 text-[10px] text-muted-foreground italic h-8 flex items-center"
                    >
                      {r.owner_notes ? `Note: "${r.owner_notes}"` : "+ Ajouter une note privée..."}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Rendez-vous</p>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary">Apport: {r.bring_olives_date ? new Date(r.bring_olives_date).toLocaleDateString() : "Attente"}</p>
                  <p className="text-sm font-bold text-primary">Collecte: {r.collect_oil_date ? new Date(r.collect_oil_date).toLocaleDateString() : "Attente"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                {r.status}
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {r.status === 'pending' && <StatusBtn onClick={() => updatePressingStatus(r._id, 'accepted')} icon={CheckCircle2} label="Accepter" color="text-primary" />}
                {(r.status === 'pending' || r.status === 'accepted') && <StatusBtn onClick={() => updatePressingStatus(r._id, 'completed')} icon={CheckCircle2} label="Terminer" color="text-green-500" />}
                {!isArchived && ['completed', 'rejected'].includes(r.status) && <StatusBtn onClick={() => archivePressing(r._id)} icon={Trash2} label="Archiver" color="text-muted-foreground" />}
                {!isArchived && <StatusBtn onClick={() => updatePressingStatus(r._id, 'rejected')} icon={XCircle} label="Refuser" color="text-red-500" />}
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <Factory className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune demande trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressingManager;
