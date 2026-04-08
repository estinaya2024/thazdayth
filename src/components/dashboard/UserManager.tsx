/**
 * USER MANAGER COMPONENT (QUIET LUXURY EDITION)
 * High-end management of client interactions and blacklist enforcement.
 * Features a minimalist, glassmorphic design with effortless administrative controls.
 */

import React, { useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Trash2, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

interface UserManagerProps {
  users: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  onRefresh
}) => {
  const { request } = useApi();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleBlacklist = async (userId: string) => {
    setLoadingId(userId);
    try {
      const data = await request<any>(`/users/${userId}/blacklist`, {
        method: 'PATCH'
      });
      toast.success(data.message || "Statut mis à jour");
      onRefresh();
    } catch (err) {
      toast.error("Échec de la mise à jour");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const searchStr = `${u.first_name} ${u.last_name} ${u.email} ${u.phone}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-12">
      {/* Header & Elegant Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight text-foreground/90 uppercase text-primary/80">Clients</h2>
          <div className="h-px w-12 bg-primary/30" />
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 py-2 bg-transparent text-sm border-b border-border/50 focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 font-light"
          />
        </div>
      </div>

      {/* Luxurious Glassmorphic Rows */}
      <div className="divide-y divide-border/20 px-4">
        {filteredUsers.map(u => (
          <div 
            key={u._id} 
            className={cn(
              "py-10 transition-all group relative",
              u.is_blacklisted && "opacity-80 grayscale-[0.5]"
            )}
          >
            {/* Background glass effect on hover */}
            <div className="absolute inset-x-0 inset-y-2 bg-primary/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-[2px]" />

            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary/40 border border-border/50 shadow-sm transition-transform group-hover:scale-105 duration-500">
                  <UserIcon className="w-7 h-7 font-light" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-light tracking-tight flex items-center gap-3">
                    {u.first_name} {u.last_name}
                    {u.is_blacklisted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-5 text-[11px] text-muted-foreground/50 font-medium">
                    <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 opacity-50" /> {u.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 opacity-50" /> {u.phone}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 opacity-50" /> {new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Sophisticated Control */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <button
                  onClick={() => toggleBlacklist(u._id)}
                  disabled={loadingId === u._id}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex items-center gap-2",
                    u.is_blacklisted 
                      ? "bg-green-500/5 border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white" 
                      : "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                  )}
                >
                  {loadingId === u._id ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    u.is_blacklisted ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />
                  )}
                  {u.is_blacklisted ? "Réhabiliter" : "Blacklister"}
                </button>
                
                <button className="p-2.5 text-muted-foreground/30 hover:text-foreground transition-all">
                   <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <UsersIcon className="w-12 h-12 text-muted-foreground/10 mx-auto mb-6" />
            <p className="text-sm font-light text-muted-foreground italic">Aucun client trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
