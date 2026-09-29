import React, { useState } from 'react';
import ConfidenceMeter from '../Common/ConfidenceMeter';
import { Check, Edit2, AlertTriangle, Save, X, Sparkles } from 'lucide-react';

export default function EditableField({ 
  fieldKey, 
  field, 
  onSave, 
  isSelected = false, 
  onClick = () => {} 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field?.value || "");
  const [isConfirmed, setIsConfirmed] = useState(field?.confidence > 90);
  const [isFlagged, setIsFlagged] = useState(field?.confidence < 70);

  if (!field) return null;

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(fieldKey, editValue);
    setIsEditing(false);
    setIsConfirmed(true);
    setIsFlagged(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditValue(field.value);
    setIsEditing(false);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    setIsConfirmed(true);
    setIsFlagged(false);
    onSave(fieldKey, field.value);
  };

  const handleFlag = (e) => {
    e.stopPropagation();
    setIsFlagged(!isFlagged);
    setIsConfirmed(false);
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "bg-brand-50/40 border-brand-300 ring-1 ring-brand-400/50 shadow-sm"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">
            {field.label}
          </span>
          <span className="text-[10.5px] text-slate-400 font-serif">
            {field.bengali || "বাংলা রূপান্তরণ"}
          </span>
        </div>

        <ConfidenceMeter value={field.confidence} size="compact" showBar={false} />
      </div>

      {/* Field Value or Edit Input */}
      {isEditing ? (
        <div className="mt-1 space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-brand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
            autoFocus
          />
          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={handleCancel}
              className="p-1 px-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="p-1 px-2 text-[12px] font-semibold bg-brand-600 text-white rounded-md hover:bg-brand-700 flex items-center gap-1 transition-colors"
            >
              <Save className="w-3 h-3" />
              <span>Save Value</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
            {field.value}
          </div>

          {/* Verification Action Buttons */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleConfirm}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isConfirmed
                  ? "bg-emerald-100 text-emerald-700 font-bold"
                  : "text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
              title="Confirm value is correct"
            >
              <Check className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              title="Edit extracted value"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFlag}
              className={`p-1.5 rounded-lg transition-colors ${
                isFlagged
                  ? "bg-amber-100 text-amber-700"
                  : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
              }`}
              title="Flag for manual supervisor check"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
