'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/lib/store/useAppStore';

interface StepSevenProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepSeven({ data, updateData, errors }: StepSevenProps) {
  const { moveInOutDepositAmount } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6">
        <h4 className="font-semibold text-cyan-900 mb-4 flex items-center gap-2">
          💰 Refundable Security Deposit
        </h4>

        {/* Deposit Amount Display */}
        <div className="text-center my-6">
          <div className="text-4xl font-bold text-cyan-600">
            ${moveInOutDepositAmount.toFixed(2)}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            value={data.paymentMethod}
            onValueChange={(value) => updateData('paymentMethod', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit-card">Credit Card</SelectItem>
              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && (
            <p className="text-sm text-destructive">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Refund Account Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="refundBSB">Refund BSB *</Label>
            <Input
              id="refundBSB"
              value={data.refundBSB}
              onChange={(e) => updateData('refundBSB', e.target.value)}
              placeholder="000-000"
            />
            {errors.refundBSB && (
              <p className="text-sm text-destructive">{errors.refundBSB}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="refundAccount">Refund Account Number *</Label>
            <Input
              id="refundAccount"
              value={data.refundAccount}
              onChange={(e) => updateData('refundAccount', e.target.value)}
              placeholder="12345678"
            />
            {errors.refundAccount && (
              <p className="text-sm text-destructive">{errors.refundAccount}</p>
            )}
          </div>
        </div>

        {/* Info Text */}
        <p className="text-sm text-cyan-800 mt-4">
          ℹ️ Deposit will be refunded within 7 business days after move completion and inspection, provided no damage has occurred.
        </p>
      </div>
    </div>
  );
}