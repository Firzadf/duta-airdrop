import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, Check, X } from 'lucide-react';

function AdminTable({ airdrops, fetchAirdrops }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleEditClick = (drop) => {
    setEditingId(drop.id);
    setEditFormData({ ...drop });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('airdrops')
        .update({
          title: editFormData.title,
          status: editFormData.status,
          cost_type: editFormData.cost_type
        })
        .eq('id', editingId);

      if (error) throw error;
      setEditingId(null);
      fetchAirdrops();
    } catch (error) {
      console.error('Error updating:', error);
      alert('Gagal update data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Yakin ingin menghapus airdrop ini?')) {
      try {
        const { error } = await supabase
          .from('airdrops')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchAirdrops();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Gagal menghapus data.');
      }
    }
  };

  if (airdrops.length === 0) return <p>Belum ada data airdrop trersimpan.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="notion-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)', fontSize: '14px' }}>
        <thead>
          <tr>
            <th>Mission Name</th>
            <th>Status</th>
            <th>Cost</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {airdrops.map((drop) => (
            <tr key={drop.id}>
              {editingId === drop.id ? (
                // EDIT MODE
                <>
                  <td>
                    <input type="text" name="title" value={editFormData.title} onChange={handleChange} />
                  </td>
                  <td>
                    <select name="status" value={editFormData.status} onChange={handleChange}>
                      <option value="Active">Active</option>
                      <option value="Claimable">Claimable</option>
                      <option value="Ended">Ended</option>
                    </select>
                  </td>
                  <td>
                    <select name="cost_type" value={editFormData.cost_type} onChange={handleChange}>
                      <option value="Free">Free</option>
                      <option value="Gas Fee">Gas Fee</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={handleSaveClick} disabled={loading} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', marginRight: '10px' }} title="Save"><Check size={18} /></button>
                    <button onClick={handleCancelClick} disabled={loading} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Cancel"><X size={18} /></button>
                  </td>
                </>
              ) : (
                // VIEW MODE
                <>
                  <td><strong style={{ fontWeight: 500 }}>{drop.title}</strong></td>
                  <td><span className={`notion-badge status-${drop.status.toLowerCase()}`}>{drop.status}</span></td>
                  <td><span className="text-muted">{drop.cost_type}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEditClick(drop)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '10px' }} title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteClick(drop.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
