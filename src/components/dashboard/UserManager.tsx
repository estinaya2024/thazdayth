/**
 * USER MANAGER COMPONENT
 * Handles viewing and blacklisting users.
 */

import React from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Trash2, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Calendar, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

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

  const toggleBlacklist = async (userId: string) => {
    try {
      const data = await request<any>(`/users/${userId}/blacklist`, {
        method: 'PATCH'
      });
      toast.success(data.message || "Statut mis à jour !");
      onRefresh();
    } catch (err) {}
  };

  const filteredUsers = users.filter(u => {
    const searchStr = `${u.first_name} ${u.last_name} ${u.email} ${u.phone}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <UsersIcon className="w-7 h-7 text-primary" />
          Gestion des Utilisateurs
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Nom, Email ou Téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-secondary/30 border border-border/50 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(u => (
          <div 
            key={u._id} 
            className={`bg-card border p-6 rounded-3xl transition-all hover:border-primary/20 ${u.is_blacklisted ? 'opacity-70 bg-secondary/10' : ''}`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary border border-border shadow-sm">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    {u.first_name} {u.last_name}
                    {u.is_blacklisted && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase">
                        Blacklisté
                      </span>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {u.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      {u.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      Inscrit le {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => toggleBlacklist(u._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${u.is_blacklisted 
                    ? 'bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20'}`}
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    {u.is_blacklisted ? "Débloquer" : "Bannir"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <UsersIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun utilisateur trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
