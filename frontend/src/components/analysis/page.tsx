"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconLeaf, IconShoppingCart } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { AnalysisProgress, AnalysisStep } from "./AnalysisProgress";

const INITIAL_STEPS: AnalysisStep[] = [
  {
    id: "fetch-product",
    label: "Fetching product details",
    status: "pending",
    message: "Retrieving title, brand, category, and pricing information.",
  },
  {
    id: "sustainability",
    label: "Checking sustainability & environmental impact",
    status: "pending",
    message: "Estimating carbon footprint, materials, and packaging impact.",
  },
  {
    id: "labor-ethics",
    label: "Evaluating labor & ethical practices",
    status: "pending",
    message: "Scanning for fair-trade labels, worker safety, and transparency.",
  },
  {
    id: "alternatives",
    label: "Scanning for better ethical alternatives",
    status: "pending",
    message:
      "Comparing similar products with higher sustainability and ethical scores.",
  },
  {
    id: "summary",
    label: "Generating summary & recommendations",
    status: "pending",
    message:
      "Preparing an easy-to-read scorecard and next-best ethical choices.",
  },
];

const calcOverall = (steps: AnalysisStep[]) => {
  if (!steps.length) return 0;
  const total = steps.reduce((sum, s) => {
    if (s.progress !== undefined) return sum + s.progress;
    if (s.status === "completed") return sum + 100;
    return sum;
  }, 0);
  return total / steps.length;
};

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const productUrl = searchParams ? searchParams.get("url") || "" : "";

  const [steps, setSteps] = useState<AnalysisStep[]>(INITIAL_STEPS);
  const [overall, setOverall] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Simulate step-by-step analysis
  useEffect(() => {
    let cancelled = false;

    const runStep = async (index: number) => {
      if (cancelled || index >= INITIAL_STEPS.length) {
        setIsAnalyzing(false);
        return;
      }

      // mark current as in progress
      setSteps((prev) => {
        const next = prev.map((s, i) => ({
          ...s,
          status:
            i < index
              ? ("completed" as AnalysisStep["status"])
              : i === index
              ? ("in-progress" as AnalysisStep["status"])
              : ("pending" as AnalysisStep["status"]),
          progress:
            i < index ? 100 : i === index ? s.progress ?? 0 : s.progress,
        }));
        setOverall(calcOverall(next));
        return next;
      });

      // fake inner progress
      for (let p = 0; p <= 100; p += 25) {
        if (cancelled) return;
        await new Promise((res) => setTimeout(res, 400));
        setSteps((prev) => {
          const next = prev.map((s, i) =>
            i === index ? { ...s, progress: p } : s
          );
          setOverall(calcOverall(next));
          return next;
        });
      }

      // mark as completed & move to next
      setSteps((prev) => {
        const next = prev.map((s, i) =>
          i === index ? { ...s, status: ("completed" as AnalysisStep["status"]), progress: 100 } : s
        );
        setOverall(calcOverall(next));
        return next;
      });

      await runStep(index + 1);
    };

    runStep(0);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div 
      className="min-h-screen relative bg-gradient-to-br from-indigo-500 to-purple-600"
    >
      {/* subtle background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.09) 0%, transparent 55%)",
        }}
      />

      <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  <IconLeaf size={24} className="text-green-200" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Ethical Analysis in Progress
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    We&apos;re analyzing this product for sustainability, labor
                    ethics, and better alternatives.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-green-100/20 text-green-200 rounded-full border border-green-200/30">
                <IconShoppingCart size={16} />
                <span className="text-sm font-medium">Live product check</span>
              </div>
            </div>

            {productUrl && (
              <div className="mt-4 p-4 bg-white/95 backdrop-blur rounded-lg border border-white/20 shadow-sm">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Product URL
                </p>
                <p className="text-sm break-all text-gray-900">
                  {productUrl}
                </p>
              </div>
            )}
          </motion.div>

          {/* Progress card */}
          <AnalysisProgress
            steps={steps}
            overallProgress={overall}
            isAnalyzing={isAnalyzing}
          />

          {/* Placeholder for future detailed results */}
          <div className="p-6 bg-white/95 backdrop-blur rounded-xl border border-white/20 shadow-sm">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">What happens after this?</h4>
              <p className="text-sm text-gray-600">
                Once all steps are completed, this page can show:
              </p>
              <ul className="ml-5 space-y-2 text-sm text-gray-700">
                <li>
                  A <strong>sustainability score</strong> (A–F or 0–100) with
                  breakdown by carbon, materials, and packaging.
                </li>
                <li>
                  An <strong>ethical rating</strong> for labor practices, certifications,
                  and supply-chain transparency.
                </li>
                <li>
                  <strong>Price comparison</strong> card showing cheaper but equally
                  ethical options.
                </li>
                <li>
                  A list of <strong>recommended alternatives</strong> with better
                  scores.
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20" />

          <p className="text-xs text-white/60 text-center">
            This is a simulated analysis flow. Next step: connect your real
            APIs / models for each step and render actual scores here.
          </p>
        </div>
      </div>
    </div>
  );
}
