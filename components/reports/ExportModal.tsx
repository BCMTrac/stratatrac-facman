'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store/useAppStore';
import { 
  generateFacilityUsageCSV, 
  generateUserActivityCSV,
  generateFacilityUsageHTML,
  generateUserActivityHTML,
  downloadFile
} from '@/lib/utils/exportHelpers';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { bookings } = useAppStore();

  const handleExportFacilityCSV = () => {
    const csv = generateFacilityUsageCSV(bookings);
    downloadFile(csv, 'facility-usage-report.csv', 'text/csv');
    toast.success('Facility Usage Report exported successfully');
    onClose();
  };

  const handleExportFacilityHTML = () => {
    const html = generateFacilityUsageHTML(bookings);
    downloadFile(html, 'facility-usage-report.html', 'text/html');
    toast.success('Facility Usage Report exported successfully');
    onClose();
  };

  const handleExportUserCSV = () => {
    const csv = generateUserActivityCSV(bookings);
    downloadFile(csv, 'user-activity-report.csv', 'text/csv');
    toast.success('User Activity Report exported successfully');
    onClose();
  };

  const handleExportUserHTML = () => {
    const html = generateUserActivityHTML(bookings);
    downloadFile(html, 'user-activity-report.html', 'text/html');
    toast.success('User Activity Report exported successfully');
    onClose();
  };

  const handleExportAllCSV = () => {
    const facilityCSV = generateFacilityUsageCSV(bookings);
    const userCSV = generateUserActivityCSV(bookings);
    const combined = `STRATA FACILITIES BOOKING SYSTEM - COMPLETE REPORTS
Generated: ${new Date().toLocaleString()}

=== FACILITY USAGE REPORTS ===

${facilityCSV}

=== USER ACTIVITY REPORTS ===

${userCSV}`;
    
    downloadFile(combined, 'complete-facility-reports.csv', 'text/csv');
    toast.success('Complete Reports Package exported successfully');
    onClose();
  };

  const handleExportAllHTML = () => {
    const facilityHTML = generateFacilityUsageHTML(bookings);
    const userHTML = generateUserActivityHTML(bookings);
    
    // Combine both reports into one HTML with page breaks
    const combined = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Complete Facility Reports</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        ${facilityHTML.replace('<!DOCTYPE html><html><head>', '').replace('</head><body>', '').replace('</body></html>', '')}
        <div class="page-break"></div>
        ${userHTML.replace('<!DOCTYPE html><html><head>', '').replace('</head><body>', '').replace('</body></html>', '')}
      </body>
      </html>
    `;
    
    downloadFile(combined, 'complete-facility-reports.html', 'text/html');
    toast.success('Complete Reports Package exported successfully');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            📥 Export Reports
          </DialogTitle>
          <p className="text-muted-foreground">
            Choose which reports to export
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Facility Usage Reports */}
          <div className="border border-border rounded-xl p-5 hover:border-primary transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Facility Usage Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Most popular facilities, time usage, category breakdown
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleExportFacilityCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button onClick={handleExportFacilityHTML} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as HTML
              </Button>
            </div>
          </div>

          {/* User Activity Reports */}
          <div className="border border-border rounded-xl p-5 hover:border-primary transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">User Activity Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Most active users, unit statistics, activity summary
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleExportUserCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button onClick={handleExportUserHTML} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as HTML
              </Button>
            </div>
          </div>

          {/* Complete Reports Package */}
          <div className="border border-border rounded-xl p-5 hover:border-primary transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Complete Reports Package</h4>
                <p className="text-sm text-muted-foreground">
                  All facility and user reports in one comprehensive file
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleExportAllCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export All as CSV
              </Button>
              <Button onClick={handleExportAllHTML} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export All as HTML
              </Button>
            </div>
          </div>

          {/* Coming Soon Placeholders */}
          <div className="border border-dashed border-border rounded-xl p-5 opacity-60">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Concierge Services Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Package collection, maintenance requests, guest registration analytics
                </p>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">Coming Soon</p>
          </div>

          <div className="border border-dashed border-border rounded-xl p-5 opacity-60">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-stone-500 to-stone-700 flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Move In / Move Out Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Loading dock usage, elevator bookings, moving coordinator scheduling
                </p>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">Coming Soon</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}