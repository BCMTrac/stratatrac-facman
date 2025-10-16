'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AddCategoryModal() {
  const { 
    isAddCategoryModalOpen, 
    setAddCategoryModalOpen,
    addCategory,
    facilities
  } = useAppStore();

  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (!categoryIcon.trim()) {
      toast.error('Please enter a category icon');
      return;
    }

    if (!categoryId.trim()) {
      toast.error('Please enter a category ID');
      return;
    }

    // Check if category ID already exists
    if (facilities[categoryId]) {
      toast.error('Category ID already exists. Please choose a different ID.');
      return;
    }

    addCategory(categoryId, categoryName, categoryIcon);
    toast.success(`Category "${categoryName}" created successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryIcon('');
    setCategoryId('');
    setAddCategoryModalOpen(false);
  };

  return (
    <Dialog open={isAddCategoryModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            📂 Add New Category
          </DialogTitle>
          <p className="text-muted-foreground">
            Create a new facility category
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category ID */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category ID *</Label>
            <Input
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="e.g., wellness, library, studio"
            />
            <p className="text-xs text-muted-foreground">
              Lowercase, no spaces (e.g., wellness-center)
            </p>
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name *</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Wellness Center"
            />
          </div>

          {/* Category Icon */}
          <div className="space-y-2">
            <Label htmlFor="categoryIcon">Category Icon (Emoji) *</Label>
            <Input
              id="categoryIcon"
              value={categoryIcon}
              onChange={(e) => setCategoryIcon(e.target.value)}
              placeholder="e.g., 🧘 or 📚 or 🎨"
              maxLength={2}
            />
            <p className="text-xs text-muted-foreground">
              Use a single emoji to represent this category
            </p>
          </div>

          {/* Preview */}
          {categoryIcon && categoryName && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-900 mb-2">Preview:</p>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg flex items-center gap-2">
                <span className="text-lg">{categoryIcon}</span>
                <span className="font-semibold">{categoryName}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}