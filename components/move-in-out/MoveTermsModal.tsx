'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, FileText } from 'lucide-react';

interface MoveTermsModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function MoveTermsModal({ open, onAccept, onDecline }: MoveTermsModalProps) {
  const { currentUser, addAuditLog } = useAppStore();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setHasScrolledToBottom(false);
      setAcceptedTerms(false);
      
      // Log that terms were displayed
      addAuditLog({
        action: 'move_terms_displayed',
        entity: 'move_in_out',
        entityId: 'terms',
        userId: currentUser?.email || 'unknown',
        userName: currentUser?.name || 'Unknown User',
        details: 'Move in/out terms and conditions displayed',
        timestamp: new Date().toISOString()
      });
    }
  }, [open, currentUser, addAuditLog]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      
      // Log that user scrolled to bottom
      addAuditLog({
        action: 'move_terms_read',
        entity: 'move_in_out',
        entityId: 'terms',
        userId: currentUser?.email || 'unknown',
        userName: currentUser?.name || 'Unknown User',
        details: 'User scrolled to bottom of terms and conditions',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAccept = () => {
    // Log acceptance
    addAuditLog({
      action: 'move_terms_accepted',
      entity: 'move_in_out',
      entityId: 'terms',
      userId: currentUser?.email || 'unknown',
      userName: currentUser?.name || 'Unknown User',
      details: 'User accepted move in/out terms and conditions',
      timestamp: new Date().toISOString()
    });
    
    onAccept();
  };

  const handleDecline = () => {
    // Log decline
    addAuditLog({
      action: 'move_terms_declined',
      entity: 'move_in_out',
      entityId: 'terms',
      userId: currentUser?.email || 'unknown',
      userName: currentUser?.name || 'Unknown User',
      details: 'User declined move in/out terms and conditions',
      timestamp: new Date().toISOString()
    });
    
    onDecline();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleDecline()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Move In/Out - Terms & Conditions
          </DialogTitle>
          <DialogDescription>
            Please read and accept the following terms before proceeding with your move request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scroll indicator */}
          {!hasScrolledToBottom && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please scroll down to read all terms and conditions
              </p>
            </div>
          )}

          {/* Terms content with scroll */}
          <ScrollArea 
            className="h-[400px] w-full rounded-md border p-6"
            onScrollCapture={handleScroll}
            ref={scrollRef}
          >
            <div className="space-y-4 pr-4">
              <h3 className="text-lg font-semibold">MOVE IN/OUT TERMS AND CONDITIONS</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">1. GENERAL PROVISIONS</h4>
                <p className="text-sm">
                  1.1. These Terms and Conditions govern all move in and move out activities within the residential building. By submitting a move request, you agree to comply with all terms outlined herein.
                </p>
                <p className="text-sm">
                  1.2. The Building Management reserves the right to modify these terms at any time without prior notice. It is your responsibility to review the current terms before each move request.
                </p>
                <p className="text-sm">
                  1.3. All move activities must be scheduled in advance and approved by Building Management. No exceptions will be made for unscheduled moves.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">2. BOOKING AND SCHEDULING</h4>
                <p className="text-sm">
                  2.1. Move requests must be submitted at least 72 hours in advance of the desired move date.
                </p>
                <p className="text-sm">
                  2.2. Move time slots are allocated on a first-come, first-served basis. Booking confirmation does not guarantee exclusive elevator use.
                </p>
                <p className="text-sm">
                  2.3. The maximum duration for a move is 8 hours within the designated time slot. Extensions may be granted at the discretion of Building Management with additional fees.
                </p>
                <p className="text-sm">
                  2.4. Cancellations must be made at least 48 hours before the scheduled move time to receive a full deposit refund.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">3. SECURITY DEPOSIT</h4>
                <p className="text-sm">
                  3.1. A refundable security deposit is required for all move activities. The deposit amount is set by Building Management and must be paid before the move date.
                </p>
                <p className="text-sm">
                  3.2. The deposit will be refunded within 7 business days after the move, provided no damage has occurred to building property.
                </p>
                <p className="text-sm">
                  3.3. Deductions from the deposit may be made for: damage to walls, floors, elevators, doors, or common areas; excessive cleaning required; overtime charges; or violation of move policies.
                </p>
                <p className="text-sm">
                  3.4. In cases where damage exceeds the deposit amount, you will be billed for the additional costs.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">4. INSURANCE REQUIREMENTS</h4>
                <p className="text-sm">
                  4.1. Proof of moving insurance or liability coverage may be required before the move date.
                </p>
                <p className="text-sm">
                  4.2. The insurance must cover damage to building property and injury to persons during the move.
                </p>
                <p className="text-sm">
                  4.3. Minimum coverage amount must meet or exceed the building's requirements as specified by Management.
                </p>
                <p className="text-sm">
                  4.4. Building Management is not responsible for damage to personal property during the move.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">5. MOVING COMPANY REQUIREMENTS</h4>
                <p className="text-sm">
                  5.1. If using professional movers, the moving company must be licensed and insured.
                </p>
                <p className="text-sm">
                  5.2. Moving company information must be provided to Building Management at least 48 hours before the move.
                </p>
                <p className="text-sm">
                  5.3. The maximum number of movers allowed is 6 persons, unless special permission is granted.
                </p>
                <p className="text-sm">
                  5.4. All movers must check in with Building Security upon arrival and departure.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">6. ELEVATOR AND COMMON AREA USE</h4>
                <p className="text-sm">
                  6.1. Elevator padding must be installed before moving begins. Building staff will assist with installation.
                </p>
                <p className="text-sm">
                  6.2. Only designated loading docks and entrances may be used for move activities.
                </p>
                <p className="text-sm">
                  6.3. Common areas including lobbies, hallways, and loading zones must be kept clear at all times.
                </p>
                <p className="text-sm">
                  6.4. Items may not be left in common areas overnight. Violations will result in removal at your expense.
                </p>
                <p className="text-sm">
                  6.5. Dollies and moving equipment must have non-marking wheels to prevent floor damage.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">7. PROPERTY PROTECTION</h4>
                <p className="text-sm">
                  7.1. You are responsible for protecting all walls, doors, floors, and fixtures during the move.
                </p>
                <p className="text-sm">
                  7.2. Corner guards and floor protection must be used where required by Building Management.
                </p>
                <p className="text-sm">
                  7.3. Any damage to building property must be reported immediately to Building Management.
                </p>
                <p className="text-sm">
                  7.4. Repairs will be arranged by Building Management and charged to you at cost plus administrative fee.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">8. PARKING AND LOADING ZONES</h4>
                <p className="text-sm">
                  8.1. Moving vehicles may only park in designated loading zones during the reserved time slot.
                </p>
                <p className="text-sm">
                  8.2. Vehicles blocking driveways, fire lanes, or other residents' access will be towed at owner's expense.
                </p>
                <p className="text-sm">
                  8.3. Loading dock assignments are made by Building Management and cannot be changed without permission.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">9. NOISE AND HOURS OF OPERATION</h4>
                <p className="text-sm">
                  9.1. Moves are only permitted during designated hours: Monday to Friday 8:00 AM - 8:00 PM, Saturday 9:00 AM - 6:00 PM.
                </p>
                <p className="text-sm">
                  9.2. No moves are permitted on Sundays or statutory holidays unless special permission is obtained.
                </p>
                <p className="text-sm">
                  9.3. Excessive noise including shouting, dropping items, or playing loud music is prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">10. WASTE DISPOSAL</h4>
                <p className="text-sm">
                  10.1. All packing materials, boxes, and moving debris must be removed from the building on the day of the move.
                </p>
                <p className="text-sm">
                  10.2. Building waste facilities may not be used for moving-related waste without prior approval.
                </p>
                <p className="text-sm">
                  10.3. Improper waste disposal will result in cleanup charges and potential deposit forfeiture.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">11. SECURITY AND ACCESS</h4>
                <p className="text-sm">
                  11.1. You are responsible for ensuring all movers and helpers have proper identification.
                </p>
                <p className="text-sm">
                  11.2. Building Security may deny access to anyone unable to provide proper identification.
                </p>
                <p className="text-sm">
                  11.3. You must be present during the entire move. Remote supervision is not permitted.
                </p>
                <p className="text-sm">
                  11.4. Door-propping or bypassing security systems is strictly prohibited and may result in fines.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">12. LIABILITY AND INDEMNIFICATION</h4>
                <p className="text-sm">
                  12.1. You agree to indemnify and hold harmless the Building, Building Management, and all staff from any claims, damages, or losses arising from your move activities.
                </p>
                <p className="text-sm">
                  12.2. This includes but is not limited to: property damage, personal injury, theft, or loss of property.
                </p>
                <p className="text-sm">
                  12.3. Building Management is not responsible for monitoring your belongings or preventing theft during the move.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">13. VIOLATIONS AND PENALTIES</h4>
                <p className="text-sm">
                  13.1. Violations of these terms may result in: immediate termination of move activities, forfeiture of security deposit, denial of future move bookings, and/or financial penalties.
                </p>
                <p className="text-sm">
                  13.2. Repeated violations may result in referral to the Strata Council for additional sanctions.
                </p>
                <p className="text-sm">
                  13.3. Building Management reserves the right to suspend moves at any time for safety or security reasons.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">14. CONTACT INFORMATION</h4>
                <p className="text-sm">
                  14.1. You must provide accurate contact information including mobile phone number for emergency contact during the move.
                </p>
                <p className="text-sm">
                  14.2. You must be available by phone during the entire move period.
                </p>
                <p className="text-sm">
                  14.3. Failure to respond to Building Management contact attempts may result in move cancellation.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-base">15. ACCEPTANCE OF TERMS</h4>
                <p className="text-sm">
                  15.1. By clicking "I Accept" below, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions.
                </p>
                <p className="text-sm">
                  15.2. You confirm that all information provided in your move request is accurate and complete.
                </p>
                <p className="text-sm">
                  15.3. You understand that violation of these terms may result in penalties as outlined above.
                </p>
                <p className="text-sm">
                  15.4. This acceptance is legally binding and constitutes an agreement between you and Building Management.
                </p>
              </section>

              <div className="border-t pt-4 mt-6">
                <p className="text-sm font-semibold">
                  IMPORTANT: Please scroll to the bottom to enable the acceptance checkbox.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last Updated: {new Date().toLocaleDateString()} | Version 2.0
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Acceptance checkbox - only enabled after scrolling */}
          <div className="flex items-start space-x-3 border-t pt-4">
            <Checkbox
              id="accept-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              disabled={!hasScrolledToBottom}
            />
            <div className="grid gap-1.5 leading-none flex-1">
              <Label
                htmlFor="accept-terms"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                  !hasScrolledToBottom ? 'opacity-50' : 'cursor-pointer'
                }`}
              >
                I have read and accept the Move In/Out Terms and Conditions
              </Label>
              <p className="text-sm text-muted-foreground">
                {!hasScrolledToBottom 
                  ? 'Please scroll to the bottom of the terms to enable this checkbox'
                  : 'You must accept the terms to proceed with your move request'
                }
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between gap-3 pt-4">
            <Button variant="outline" onClick={handleDecline} className="flex-1">
              Decline & Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={!acceptedTerms}
              className="flex-1"
            >
              I Accept - Continue to Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
