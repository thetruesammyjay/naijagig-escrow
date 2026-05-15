"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { MilestoneBuilder, type MilestoneInput } from "./MilestoneBuilder";
import { WalletDisplay } from "../wallet/WalletDisplay";
import { useCreateJob } from "../../hooks/useJob";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../ui/toast";
import { useRouter } from "next/navigation";

export function JobForm() {
  const router = useRouter();
  const { createJob, isSubmitting, submitError } = useCreateJob();
  const { address } = useWallet();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);

  // Validate that milestone amounts sum to total
  const milestoneSum = milestones.reduce(
    (acc, m) => acc + (parseFloat(m.amount) || 0),
    0
  );
  const total = parseFloat(totalAmount) || 0;
  const isBalanced =
    milestones.length > 0 && Math.abs(milestoneSum - total) < 0.0000001;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error("Please connect your Freighter wallet before posting a job.");
      return;
    }

    if (milestones.length === 0) {
      toast.error("Add at least one milestone before posting.");
      return;
    }

    if (!isBalanced) {
      toast.error(
        "Milestone amounts must sum exactly to the total job amount."
      );
      return;
    }

    const job = await createJob({
      title,
      description,
      totalAmount,
      freelancerStellarAddress: freelancerAddress || undefined,
      milestones: milestones.map((m) => ({
        title: m.title,
        description: m.description,
        amount: m.amount,
      })),
    });

    if (job) {
      toast.success("Job posted successfully! Redirecting to job details…");
      router.push(`/client/jobs/${job.id}`);
    } else {
      toast.error(submitError ?? "Failed to create job. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wallet requirement */}
      <Card>
        <CardHeader>
          <CardTitle>Stellar Wallet</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            A connected wallet is required to fund the escrow contract.
          </p>
        </CardHeader>
        <CardContent>
          <WalletDisplay />
        </CardContent>
      </Card>

      {/* Job details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Provide clear requirements to attract the right freelancer.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Job Title"
            placeholder="e.g. Fullstack E-commerce Website with Next.js"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Describe the project scope, timeline, and specific deliverables..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total Budget (USDC)"
              type="number"
              placeholder="e.g. 500.0000000"
              icon="bi-currency-dollar"
              required
              min="0"
              step="0.0000001"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              helperText="Stellar uses 7 decimal places"
            />
            <Input
              label="Freelancer Stellar Address"
              placeholder="G... (optional — can assign later)"
              icon="bi-person-badge"
              value={freelancerAddress}
              onChange={(e) => setFreelancerAddress(e.target.value)}
              helperText="Required before escrow deploys"
            />
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Escrow Setup</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Define payment milestones. Amounts are locked in the smart contract
            and cannot be changed after deployment.
          </p>
        </CardHeader>
        <CardContent>
          <MilestoneBuilder
            totalAmount={totalAmount}
            milestones={milestones}
            onChange={setMilestones}
          />
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon="bi-shield-lock"
            disabled={!address || !isBalanced || milestones.length === 0}
          >
            Post Job &amp; Deploy Escrow
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
