import React, { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  Search,
  Plus,
  UserCheck,
  ShieldCheck,
  Mail,
  Building,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Clock,
  KeyRound,
  Filter
} from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { OfficerUser } from '../types';
import { Modal } from '../components/Common/Modal';
import { useToast } from '../context/ToastContext';

export const Users: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<string>('Revenue Officer');
  const [newUserDept, setNewUserDept] = useState<string>('Land Records & Revenue');
  const [newUserEmail, setNewUserEmail] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3001/api/officers')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, []);

  const departments = ['All', 'Land Records & Revenue', 'Survey & Cadastre', 'Quality Assurance', 'Cadastral Mapping', 'Digitization Unit'];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.wing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || u.wing === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: OfficerUser = {
      id: 'u-' + Date.now(),
      name: newUserName,
      role: newUserRole,
      department: newUserDept,
      status: 'Active',
      lastActive: 'Just now',
      email: newUserEmail,
      recordsProcessed: 0
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast('Officer Profile Registered', `${newUser.name} added to the official civil roster.`, 'success');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = u.status === 'Active' ? 'Inactive' : 'Active';
          showToast('Status Updated', `${u.name} duty status changed to ${updated}.`, 'info');
          return { ...u, status: updated };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Institutional Title & Authority Header */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Revenue Officers &amp; Cadastral Staff Roster
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Authorized administrative officers, Cadastral Amins, and verification specialists assigned to Darjeeling Sadar Circle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="gov-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Officer</span>
          </button>
        </div>
      </div>

      {/* Roster Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Officers on Duty</span>
            <UserCheck className="w-4 h-4 text-[var(--color-success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2 font-sans">
            {users.filter((u) => u.status === 'Active').length}
            <span className="text-sm font-normal text-[var(--color-muted)] ml-1.5">/ {users.length} enrolled</span>
          </p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Khatians Processed</span>
            <FileCheck2 className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2 font-sans">
            {users.reduce((acc, u) => acc + u.recordsProcessed, 0).toLocaleString()}
          </p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Active Circle</span>
            <MapPin className="w-4 h-4 text-[var(--color-warning)]" />
          </div>
          <p className="text-xl font-bold text-[var(--color-text-primary)] mt-2 font-sans truncate">
            Darjeeling Sadar
          </p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Civil Roster Sync</span>
            <Clock className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <p className="text-sm font-bold text-[var(--color-text-primary)] mt-2 font-sans">
            Today, 14:30 IST · Verified
          </p>
        </div>
      </div>

      {/* Officers Table Container */}
      <div className="gov-card overflow-hidden">
        {/* Search & Department Filters */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search officer by name, designation, email, or wing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gov-input pl-9"
            />
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-2.5" />
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-sm">
            <span className="text-[var(--color-muted)] font-medium text-sm hidden sm:inline mr-1">Wing:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedDept === dept
                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-2xs'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-border-subtle)]'
                }`}
              >
                {dept === 'All' ? 'All Wings' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table — avatar-first */}
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Wing</th>
                <th>Status</th>
                <th>Last Session</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  {/* Avatar-first name cell */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-success-border)' }}
                      >
                        {user.name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block', fontSize: 14, color: 'var(--color-text)' }}>{user.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                          {user.designation}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{user.wing}</span>
                  </td>

                  <td>
                    {user.status === 'Active' ? (
                      <span className="badge badge-success">
                        <span className="dot-success" /> Active
                      </span>
                    ) : (
                      <span className="badge badge-neutral">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-muted)', display: 'inline-block' }} />
                        Inactive
                      </span>
                    )}
                  </td>

                  <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>Active Session</td>

                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      className="gov-btn-outline"
                      style={{
                        padding: '5px 12px', fontSize: 12, borderRadius: 6,
                        color: user.status === 'Active' ? 'var(--color-critical)' : 'var(--color-success)',
                        borderColor: user.status === 'Active' ? 'var(--color-critical-border)' : 'var(--color-success-border)',
                      }}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[var(--color-border-subtle)] border-t border-[var(--color-border)] text-sm text-[var(--color-muted)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Showing {filteredUsers.length} of {users.length} enrolled department personnel</span>
          <span className="text-[var(--color-muted)]">Authorized by Sub-Divisional Land Reforms Officer (SDL&amp;LRO)</span>
        </div>
      </div>

      {/* Add Officer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll Revenue Officer / Field Staff"
        subtitle="Authorize a new civil official for Darjeeling Sadar Circle"
        maxWidth="md"
      >
        <form onSubmit={handleAddOfficer} className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1">Officer Full Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Chandra Mukherjee"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1">Official Govt. Email ID (.gov.in):</label>
            <input
              type="email"
              required
              placeholder="e.g. ramesh.cm@lrc.wb.gov.in"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1">Official Designation:</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            >
              <option value="Revenue Officer">Revenue Officer (Class I)</option>
              <option value="Senior Revenue Inspector">Senior Revenue Inspector</option>
              <option value="Cadastral Amin / Surveyor">Cadastral Amin / Surveyor</option>
              <option value="Verification Specialist">Verification Specialist</option>
              <option value="GIS & Cartography Specialist">GIS &amp; Cartography Specialist</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1">Departmental Wing:</label>
            <select
              value={newUserDept}
              onChange={(e) => setNewUserDept(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            >
              <option value="Land Records & Revenue">Land Records &amp; Revenue</option>
              <option value="Survey & Cadastre">Survey &amp; Cadastre</option>
              <option value="Quality Assurance">Quality Assurance &amp; Verification</option>
              <option value="Cadastral Mapping">Cadastral Mapping</option>
              <option value="Digitization Unit">Digitization Unit</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-border-subtle)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold shadow-xs transition-colors"
            >
              Register &amp; Issue Credentials
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
