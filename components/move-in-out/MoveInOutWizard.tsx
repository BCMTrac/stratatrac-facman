'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WizardProgress } from './WizardProgress';
import { MoveTermsModal } from './MoveTermsModal';
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';
import { StepSix } from './steps/StepSix';
import { StepSeven } from './steps/StepSeven';
import { toast } from 'sonner';

const TOTAL_STEPS = 7;

export function MoveInOutWizard() {
  const { 
    isMoveInOutModalOpen, 
    setMoveInOutModalOpen,
    currentUser,
    addBooking,
    addAuditLog,
    moveInOutDepositAmount
  } = useAppStore();

  const [showTerms, setShowTerms] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    // Step 1
    moveType: '',
    moveDate: '',
    moveTime: '',
    moveDuration: '',
    // Step 2
    residentName: currentUser?.name || '',
    residentUnit: '',
    residentEmail: currentUser?.email || '',
    residentPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    // Step 3
    companyName: '',
    companyContact: '',
    companyPhone: '',
    vehicleRego: '',
    vehicleType: '',
    numMovers: '',
    insuranceFile: null,
    // Step 4
    loadingDock: true,
    serviceElevator: true,
    visitorParking: false,
    movingTrolleys: false,
    dockSelection: '',
    parkingBay: '',
    // Step 5
    itemPiano: false,
    itemFurniture: false,
    itemFragile: false,
    itemAppliances: false,
    itemOffice: false,
    itemVehicle: false,
    specialNotes: '',
    // Step 6
    ack1: false,
    ack2: false,
    ack3: false,
    ack4: false,
    ack5: false,
    ack6: false,
    // Step 7
    paymentMethod: '',
    refundBSB: '',
    refundAccount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.moveType) newErrors.moveType = 'Please select move type';
        if (!formData.moveDate) newErrors.moveDate = 'Please select move date';
        if (!formData.moveTime) newErrors.moveTime = 'Please select time slot';
        if (!formData.moveDuration) newErrors.moveDuration = 'Please select duration';
        break;
      case 2:
        if (!formData.residentName) newErrors.residentName = 'Name is required';
        if (!formData.residentUnit) newErrors.residentUnit = 'Unit is required';
        if (!formData.residentEmail) newErrors.residentEmail = 'Email is required';
        if (!formData.residentPhone) newErrors.residentPhone = 'Phone is required';
        if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
        if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';
        break;
      case 3:
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.companyContact) newErrors.companyContact = 'Contact person is required';
        if (!formData.companyPhone) newErrors.companyPhone = 'Company phone is required';
        if (!formData.vehicleRego) newErrors.vehicleRego = 'Vehicle registration is required';
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        if (!formData.numMovers) newErrors.numMovers = 'Number of movers is required';
        break;
      case 4:
        if (!formData.dockSelection) newErrors.dockSelection = 'Please select loading dock';
        break;
      case 6:
        if (!formData.ack1 || !formData.ack2 || !formData.ack3 || 
            !formData.ack4 || !formData.ack5 || !formData.ack6) {
          newErrors.acknowledgments = 'All acknowledgments must be checked';
        }
        break;
      case 7:
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
        if (!formData.refundBSB) newErrors.refundBSB = 'BSB is required';
        if (!formData.refundAccount) newErrors.refundAccount = 'Account number is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const moveRequestId = 'MOVE' + Date.now().toString().slice(-6);
    const moveType = formData.moveType === 'in' ? 'Moving In' : 'Moving Out';

    const newBooking = {
      id: moveRequestId,
      facility: 'Move In / Move Out Request',
      category: 'moveinout' as const,
      date: formData.moveDate,
      time: formData.moveTime.split('-')[0],
      duration: formData.moveDuration,
      user: {
        name: formData.residentName,
        unit: formData.residentUnit,
        email: formData.residentEmail,
        phone: formData.residentPhone,
      },
      purpose: moveType,
      createdBy: currentUser?.email || '',
      status: 'pending' as const,
      statusHistory: [{
        status: 'pending' as const,
        timestamp: new Date().toISOString(),
        updatedBy: currentUser?.email || 'system',
        note: 'Move request submitted'
      }],
      notifications: []
    };

    addBooking(newBooking);
    
    // Audit log for move request creation
    addAuditLog({
      action: 'move_request_created',
      entity: 'move_in_out',
      entityId: moveRequestId,
      userId: currentUser?.email || 'unknown',
      userName: currentUser?.name || 'Unknown User',
      details: `${moveType} request created for ${formData.moveDate} at ${formData.moveTime}. Deposit: ${moveInOutDepositAmount}`,
      timestamp: new Date().toISOString()
    });
    
    // Send notification to admins
    const { sendNotification } = useAppStore.getState();
    sendNotification(
      moveRequestId,
      'email',
      'admin@building.com',
      `NEW MOVE REQUEST: ${formData.residentName} (Unit ${formData.residentUnit}) has submitted a ${moveType} request for ${formData.moveDate} at ${formData.moveTime}. Moving company: ${formData.companyName}. Deposit required: ${moveInOutDepositAmount}. Reference: ${moveRequestId}`,
      'move_request_submitted_admin'
    );
    
    // Send confirmation to user
    sendNotification(
      moveRequestId,
      'email',
      formData.residentEmail,
      `Your ${moveType} request has been submitted successfully! Reference: ${moveRequestId}. Date: ${formData.moveDate} at ${formData.moveTime}. We will review your request and contact you within 24 hours. Deposit amount: ${moveInOutDepositAmount}`,
      'move_request_submitted_user'
    );
    
    // Send SMS to user
    sendNotification(
      moveRequestId,
      'sms',
      formData.residentPhone,
      `${moveType} request submitted! Ref: ${moveRequestId}. Date: ${formData.moveDate}. Check email for details.`,
      'move_request_submitted_user'
    );
    
    toast.success(`✅ Move ${formData.moveType === 'in' ? 'In' : 'Out'} request submitted successfully!`, {
      description: `Reference: ${moveRequestId} - Check your email for confirmation`
    });
    
    handleClose();
  };

  const handleClose = () => {
    setMoveInOutModalOpen(false);
    setShowTerms(true);
    setCurrentStep(1);
    setFormData({
      moveType: '',
      moveDate: '',
      moveTime: '',
      moveDuration: '',
      residentName: currentUser?.name || '',
      residentUnit: '',
      residentEmail: currentUser?.email || '',
      residentPhone: '',
      emergencyContact: '',
      emergencyPhone: '',
      companyName: '',
      companyContact: '',
      companyPhone: '',
      vehicleRego: '',
      vehicleType: '',
      numMovers: '',
      insuranceFile: null,
      loadingDock: true,
      serviceElevator: true,
      visitorParking: false,
      movingTrolleys: false,
      dockSelection: '',
      parkingBay: '',
      itemPiano: false,
      itemFurniture: false,
      itemFragile: false,
      itemAppliances: false,
      itemOffice: false,
      itemVehicle: false,
      specialNotes: '',
      ack1: false,
      ack2: false,
      ack3: false,
      ack4: false,
      ack5: false,
      ack6: false,
      paymentMethod: '',
      refundBSB: '',
      refundAccount: '',
    });
    setErrors({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={formData} updateData={updateData} errors={errors} />;
      case 2:
        return <StepTwo data={formData} updateData={updateData} errors={errors} />;
      case 3:
        return <StepThree data={formData} updateData={updateData} errors={errors} />;
      case 4:
        return <StepFour data={formData} updateData={updateData} errors={errors} />;
      case 5:
        return <StepFive data={formData} updateData={updateData} errors={errors} />;
      case 6:
        return <StepSix data={formData} updateData={updateData} errors={errors} />;
      case 7:
        return <StepSeven data={formData} updateData={updateData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <>
      <MoveTermsModal
        open={isMoveInOutModalOpen && showTerms}
        onAccept={() => setShowTerms(false)}
        onDecline={handleClose}
      />
      
      <Dialog open={isMoveInOutModalOpen && !showTerms} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            📦 Move In / Move Out Request
          </DialogTitle>
          <p className="text-muted-foreground">
            Complete this form to schedule your move and reserve required facilities
          </p>
        </DialogHeader>

        <div className="py-4">
          <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          
          <div className="mt-6">
            {renderStep()}
          </div>

          <div className="flex gap-3 justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}