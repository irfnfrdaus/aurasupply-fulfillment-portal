import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function NewOrderModal({ isOpen, onClose, inventory, onSubmitOrder }) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState('Standard');
  const [carrier, setCarrier] = useState('Line Clear Logistics');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    { sku: inventory[0]?.sku || '', quantity: 1 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { sku: inventory[0]?.sku || '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const itemsPayload = selectedItems.map((sel) => {
        const invItem = inventory.find((i) => i.sku === sel.sku);
        return {
          sku: sel.sku,
          item_name: invItem ? invItem.name : 'Custom Item',
          quantity: parseInt(sel.quantity, 10) || 1,
          unit_price: invItem ? invItem.unit_price : 100.0
        };
      });

      await onSubmitOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        priority,
        carrier,
        notes,
        items: itemsPayload
      });

      onClose();
    } catch (err) {
      alert(`Failed to create order: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-bold text-base text-white">Create Enterprise B2B Order</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Customer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. PETRONAS Carigali, Inari, etc."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Procurement Contact Email</label>
              <input
                type="email"
                placeholder="procure@enterprise.com.my"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fulfillment Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Standard">Standard (14 Days)</option>
                <option value="High">High (7 Days)</option>
                <option value="Critical">Critical (Urgent 48h Flight)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logistics Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="DHL Express">DHL Express</option>
                <option value="FedEx Global">FedEx Global</option>
                <option value="Line Clear Logistics">Line Clear Logistics</option>
                <option value="Direct Fleet">Direct Dedicated Fleet</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {selectedItems.map((sel, idx) => {
                const inv = inventory.find((i) => i.sku === sel.sku);
                return (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <select
                      value={sel.sku}
                      onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:outline-none focus:border-sky-500"
                    >
                      {inventory.map((inv) => (
                        <option key={inv.sku} value={inv.sku}>
                          {inv.sku} - {inv.name} (RM {inv.unit_price})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={sel.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-16 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white text-center focus:outline-none focus:border-sky-500"
                    />

                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Dispatch Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Requires cleanroom packaging, delivery gate pass required..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition disabled:opacity-50"
            >
              {submitting ? 'Generating PO...' : 'Create Order (Quote Stage)'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
