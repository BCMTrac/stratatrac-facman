'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Facility } from '@/lib/types';
import { FacilityTimeSettingsModal } from './FacilityTimeSettingsModal';

export function ConfigureFacilitiesModal() {
  const { 
    isConfigureFacilitiesModalOpen, 
    setConfigureFacilitiesModalOpen,
    facilities,
    addFacilityToCategory,
    updateFacility,
    deleteFacility,
    deleteCategory,
    updateFacilityTimeSettings
  } = useAppStore();

  const [timeSettingsModal, setTimeSettingsModal] = useState<{
    open: boolean;
    categoryId: string;
    facility: Facility | null;
  }>({ open: false, categoryId: '', facility: null });

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [editingFacility, setEditingFacility] = useState<{ categoryId: string; facilityId: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityIcon, setNewFacilityIcon] = useState('');

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEditFacility = (categoryId: string, facility: Facility) => {
    setEditingFacility({ categoryId, facilityId: facility.id });
    setEditName(facility.name);
    setEditIcon(facility.icon);
  };

  const handleSaveEdit = () => {
    if (!editingFacility) return;
    
    if (!editName.trim() || !editIcon.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    updateFacility(editingFacility.categoryId, editingFacility.facilityId, {
      name: editName,
      icon: editIcon
    });
    
    toast.success('Facility updated successfully');
    setEditingFacility(null);
    setEditName('');
    setEditIcon('');
  };

  const handleDeleteFacility = (categoryId: string, facilityId: string, facilityName: string) => {
    if (confirm(`Are you sure you want to delete "${facilityName}"?`)) {
      deleteFacility(categoryId, facilityId);
      toast.success('Facility deleted successfully');
    }
  };

  const handleToggleFacility = (categoryId: string, facilityId: string, currentState: boolean) => {
    updateFacility(categoryId, facilityId, { enabled: !currentState });
    toast.success(currentState ? 'Facility disabled' : 'Facility enabled');
  };

  const handleAddFacility = (categoryId: string) => {
    if (!newFacilityName.trim() || !newFacilityIcon.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addFacilityToCategory(categoryId, {
      name: newFacilityName,
      icon: newFacilityIcon,
      enabled: true
    });

    toast.success('Facility added successfully');
    setAddingToCategory(null);
    setNewFacilityName('');
    setNewFacilityIcon('');
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (!facilities[categoryId].isCustom) {
      toast.error('Cannot delete default categories');
      return;
    }

    if (confirm(`Are you sure you want to delete the entire "${categoryName}" category? This will remove all facilities in this category.`)) {
      deleteCategory(categoryId);
      toast.success('Category deleted successfully');
    }
  };

  return (
    <>
      <FacilityTimeSettingsModal
        open={timeSettingsModal.open}
        onClose={() => setTimeSettingsModal({ open: false, categoryId: '', facility: null })}
        facilityName={timeSettingsModal.facility?.name || ''}
        currentSettings={timeSettingsModal.facility?.timeSettings}
        onSave={(settings) => {
          if (timeSettingsModal.facility) {
            updateFacilityTimeSettings(
              timeSettingsModal.categoryId,
              timeSettingsModal.facility.id,
              settings
            );
          }
        }}
      />
      
      <Dialog open={isConfigureFacilitiesModalOpen} onOpenChange={setConfigureFacilitiesModalOpen}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            ⚙️ Configure Facilities
          </DialogTitle>
          <p className="text-muted-foreground">
            Manage facilities across all categories
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.entries(facilities).map(([categoryId, category]) => (
            <div key={categoryId} className="border border-border rounded-xl overflow-hidden">
              {/* Category Header */}
              <div
                className={`p-4 cursor-pointer transition-colors ${
                  category.isCustom
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => toggleCategory(categoryId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-semibold text-lg">{category.name}</span>
                    {category.isCustom && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Custom</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {category.isCustom && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(categoryId, category.name);
                        }}
                        className="text-white hover:bg-white/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {expandedCategories.includes(categoryId) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Category Content */}
              {expandedCategories.includes(categoryId) && (
                <div className="p-4 space-y-3 bg-card">
                  {category.facilities.map((facility) => (
                    <div key={facility.id} className="border border-border rounded-lg p-3">
                      {editingFacility?.facilityId === facility.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Icon</Label>
                              <Input
                                value={editIcon}
                                onChange={(e) => setEditIcon(e.target.value)}
                                maxLength={2}
                              />
                            </div>
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingFacility(null);
                                setEditName('');
                                setEditIcon('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{facility.icon}</span>
                            <div className="flex flex-col">
                              <span className={facility.enabled ? 'font-medium' : 'text-muted-foreground line-through'}>
                                {facility.name}
                              </span>
                              {facility.timeSettings && (
                                <span className="text-xs text-muted-foreground">
                                  ⏱️ {facility.timeSettings.timeIntervalMinutes}min intervals • 
                                  {facility.timeSettings.operatingHours.start}-{facility.timeSettings.operatingHours.end}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Enabled</Label>
                              <Switch
                                checked={facility.enabled}
                                onCheckedChange={() => handleToggleFacility(categoryId, facility.id, facility.enabled)}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setTimeSettingsModal({ open: true, categoryId, facility })}
                              title="Configure time settings"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditFacility(categoryId, facility)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFacility(categoryId, facility.id, facility.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add New Facility */}
                  {addingToCategory === categoryId ? (
                    <div className="border-2 border-dashed border-primary rounded-lg p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Icon</Label>
                          <Input
                            value={newFacilityIcon}
                            onChange={(e) => setNewFacilityIcon(e.target.value)}
                            placeholder="🏊"
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={newFacilityName}
                            onChange={(e) => setNewFacilityName(e.target.value)}
                            placeholder="Pool Name"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddFacility(categoryId)}>
                          Add Facility
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAddingToCategory(null);
                            setNewFacilityName('');
                            setNewFacilityIcon('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingToCategory(categoryId)}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Facility to {category.name}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => setConfigureFacilitiesModalOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}