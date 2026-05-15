"use client";
/**
 * MilestoneBuilder — dynamic form for creating job milestones.
 *
 * Rules from context.md:
 * - Amounts must be strings (USDC precision)
 * - Sum of milestone amounts must equal the job total amount
 * - Amounts are immutable after escrow init (warn user)
 * - Freelancer address is required at escrow init
 */
import React, { useCallback, useState } from "react";

export interface MilestoneInput {
  title: string;
  description: string;
  amount: string;
}

interface MilestoneBuilderProps {
  totalAmount: string;
  milestones: MilestoneInput[];
  onChange: (milestones: MilestoneInput[]) => void;
}

const EMPTY_MILESTONE: MilestoneInput = {
  title: "",
  description: "",
  amount: "",
};

function sumAmounts(milestones: MilestoneInput[]): number {
  return milestones.reduce((acc, m) => {
    const val = parseFloat(m.amount);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
}

export function MilestoneBuilder({
  totalAmount,
  milestones,
  onChange,
}: MilestoneBuilderProps) {
  const total = parseFloat(totalAmount) || 0;
  const currentSum = sumAmounts(milestones);
  const remaining = total - currentSum;
  const isBalanced = Math.abs(remaining) < 0.0000001;
  const isOverAllocated = currentSum > total;

  const add = useCallback(() => {
    onChange([...milestones, { ...EMPTY_MILESTONE }]);
  }, [milestones, onChange]);

  const remove = useCallback(
    (index: number) => {
      onChange(milestones.filter((_, i) => i !== index));
    },
    [milestones, onChange]
  );

  const update = useCallback(
    (index: number, field: keyof MilestoneInput, value: string) => {
      const next = milestones.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      );
      onChange(next);
    },
    [milestones, onChange]
  );

  const moveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const next = [...milestones];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      onChange(next);
    },
    [milestones, onChange]
  );

  const moveDown = useCallback(
    (index: number) => {
      if (index === milestones.length - 1) return;
      const next = [...milestones];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      onChange(next);
    },
    [milestones, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Allocation summary */}
      <div
        className={`flex items-center justify-between text-sm px-4 py-3 rounded-xl border ${
          isOverAllocated
            ? "bg-red-50 border-red-200 text-red-800"
            : isBalanced
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-yellow-50 border-yellow-200 text-yellow-800"
        }`}
      >
        <span className="font-semibold">
          {isOverAllocated ? (
            <>
              <i className="bi bi-exclamation-triangle-fill mr-2" />
              Over-allocated by {Math.abs(remaining).toFixed(7)} USDC
            </>
          ) : isBalanced ? (
            <>
              <i className="bi bi-check-circle-fill mr-2" />
              Milestones fully allocated
            </>
          ) : (
            <>
              <i className="bi bi-info-circle-fill mr-2" />
              {remaining.toFixed(7)} USDC remaining to allocate
            </>
          )}
        </span>
        <span className="font-mono text-xs">
          {currentSum.toFixed(7)} / {total.toFixed(7)} USDC
        </span>
      </div>

      {/* Immutability warning */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-orange-800 text-xs flex gap-2">
        <i className="bi bi-lock-fill text-orange-500 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Note:</strong> Milestone amounts cannot be changed after the
          escrow contract is deployed. Plan your milestones carefully before
          submitting.
        </p>
      </div>

      {/* Milestone rows */}
      {milestones.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-6 border-2 border-dashed border-gray-200 rounded-xl">
          No milestones yet. Add your first milestone below.
        </p>
      )}

      {milestones.map((m, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-2xl p-5 bg-white space-y-4 relative hover:border-primary/30 transition-colors"
        >
          {/* Milestone header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Milestone {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                title="Move up"
              >
                <i className="bi bi-chevron-up text-sm" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === milestones.length - 1}
                className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                title="Move down"
              >
                <i className="bi bi-chevron-down text-sm" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors ml-1"
                title="Remove milestone"
              >
                <i className="bi bi-trash text-sm" />
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={m.title}
                onChange={(e) => update(index, "title", e.target.value)}
                placeholder="e.g. Homepage Design & Development"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={m.description}
                onChange={(e) => update(index, "description", e.target.value)}
                placeholder="Describe what will be delivered for this milestone..."
                required
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Amount (USDC) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-semibold text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => update(index, "amount", e.target.value)}
                  placeholder="0.0000000"
                  required
                  min="0"
                  step="0.0000001"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-7 pr-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add milestone button */}
      <button
        type="button"
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 hover:border-primary/50 transition-all flex items-center justify-center gap-2"
      >
        <i className="bi bi-plus-lg" />
        Add Milestone
      </button>

      {/* Validation message */}
      {milestones.length > 0 && !isBalanced && (
        <p className="text-xs text-yellow-700 font-medium text-center">
          Total milestone amounts must equal{" "}
          <span className="font-mono">{total.toFixed(7)}</span> USDC before you
          can submit.
        </p>
      )}
    </div>
  );
}
