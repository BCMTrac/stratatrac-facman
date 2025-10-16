'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface StepSixProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepSix({ data, updateData, errors }: StepSixProps) {
  const acknowledgments = [
    { id: 'ack1', text: 'I have read and understand the building\'s moving policy' },
    { id: 'ack2', text: 'I will only move during permitted hours (Mon-Sat, 8am-6pm)' },
    { id: 'ack3', text: 'I will protect all common areas (hallways, elevators, lobbies)' },
    { id: 'ack4', text: 'I am responsible for any damage caused during the move' },
    { id: 'ack5', text: 'Moving company has current public liability insurance ($10M minimum)' },
    { id: 'ack6', text: 'I will remove all packing materials within 48 hours' },
  ];

  const allAcknowledged = acknowledgments.every(ack => data[ack.id]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
          ☑️ Building Compliance & Acknowledgments
        </h4>

        <div className="space-y-3">
          {acknowledgments.map((ack) => (
            <div key={ack.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
              <Checkbox
                id={ack.id}
                checked={data[ack.id] ?? false}
                onCheckedChange={(checked) => updateData(ack.id, checked)}
                className="mt-1"
              />
              <Label
                htmlFor={ack.id}
                className="cursor-pointer flex-1 text-sm leading-relaxed"
              >
                {ack.text}
              </Label>
            </div>
          ))}
        </div>

        {!allAcknowledged && (
          <p className="text-sm text-amber-800 mt-4 font-medium">
            ⚠️ All acknowledgments must be checked to proceed
          </p>
        )}

        {Object.keys(errors).length > 0 && (
          <p className="text-sm text-destructive mt-4">
            Please acknowledge all building compliance requirements
          </p>
        )}
      </div>
    </div>
  );
}