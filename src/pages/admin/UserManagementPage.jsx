import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Shield, User, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { ROLE_CONFIG } from '../../config/roles';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setUsers(data || []);
    } catch (e) {
      console.error('Failed to load Supabase profiles:', e);
      setError(e.message || 'Failed to load user profiles from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, nextRole) => {
    setUpdatingId(userId);
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ role: nextRole })
        .eq('id', userId);

      if (err) throw err;
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)));
    } catch (e) {
      alert(`Role change failed: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management & RBAC Governance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated Supabase user roles, tenant boundaries, and access tiers directly in the database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input
              icon={Search}
              placeholder="Search by name, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={loadUsers} variant="secondary" size="md" loading={loading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>Database query error: {error}</span>
          </div>
          <Button onClick={loadUsers} variant="ghost" size="sm">Retry</Button>
        </div>
      )}

      <Card glass className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Active Role</th>
                <th className="p-4">Business / Dept</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Assign RBAC Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                      <span>Loading authenticated users from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <User className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No users found</p>
                    <p className="text-[11px] text-slate-500 mt-1">Users will appear here as they register through Supabase Auth.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const roleConfig = ROLE_CONFIG[u.role] || { label: u.role, badgeVariant: 'primary' };
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-semibold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                          {u.full_name?.charAt(0) || u.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{u.full_name || 'Anonymous User'}</div>
                          <div className="text-[10px] font-mono text-slate-500">{u.id.substring(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-mono">{u.email}</td>
                      <td className="p-4">
                        <Badge variant={roleConfig.badgeVariant || 'primary'} size="sm">
                          {roleConfig.label || u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400">
                        {u.business_name || u.department || '—'}
                      </td>
                      <td className="p-4 text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role || 'consumer'}
                          disabled={updatingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="consumer">Consumer</option>
                          <option value="vendor">Vendor</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;
