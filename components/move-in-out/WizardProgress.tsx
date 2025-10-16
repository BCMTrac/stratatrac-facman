'use client';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  'Move Type',
  'Resident Info',
  'Moving Company',
  'Facilities',
  'Special Items',
  'Acknowledgments',
  'Payment'
];

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {stepTitles[currentStep - 1]}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
              i < currentStep
                ? 'bg-primary text-primary-foreground'
                : i === currentStep - 1
                ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}