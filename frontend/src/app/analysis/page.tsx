"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconExternalLink, IconAlertCircle, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { AnalysisStep } from "../../components/analysis/AnalysisProgress";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const [productUrl, setProductUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>([]);
  
  // Initial analysis steps
  const initialSteps: AnalysisStep[] = [
    {
      id: "url-validation",
      label: "Validating Product URL",
      status: "pending",
      message: "Checking if the URL is accessible and contains product data"
    },
    {
      id: "product-extraction", 
      label: "Extracting Product Information",
      status: "pending",
      message: "Getting product title, price, description, and images"
    },
    {
      id: "sustainability-check",
      label: "Analyzing Sustainability Metrics", 
      status: "pending",
      message: "Checking environmental impact and eco-certifications"
    },
    {
      id: "ethical-evaluation",
      label: "Evaluating Ethical Practices",
      status: "pending", 
      message: "Assessing labor practices and fair trade compliance"
    },
    {
      id: "price-comparison",
      label: "Comparing Prices Across Platforms",
      status: "pending",
      message: "Finding better deals on similar products"
    },
    {
      id: "alternatives-search",
      label: "Finding Ethical Alternatives",
      status: "pending",
      message: "Searching for more sustainable product options"
    }
  ];

  // Read URL query param on component mount
  useEffect(() => {
    if (searchParams) {
      const url = searchParams.get("url");
      if (url) {
        setProductUrl(decodeURIComponent(url));
        setSteps(initialSteps);
      } else {
        // Redirect to home if no URL provided
        window.location.href = "/";
      }
    }
  }, [searchParams]);

  // Simulate step-by-step analysis
  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setOverallProgress(0);
    
    for (let i = 0; i < initialSteps.length; i++) {
      const currentStep = initialSteps[i];
      
      // Update current step to in-progress
      setSteps(prev => prev.map(step => 
        step.id === currentStep.id 
          ? { ...step, status: "in-progress", progress: 0 }
          : step
      ));

      // Simulate progress for current step
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setSteps(prev => prev.map(step =>
          step.id === currentStep.id
            ? { ...step, progress }
            : step
        ));
        
        // Update overall progress
        const stepProgress = (i * 100 + progress) / initialSteps.length;
        setOverallProgress(stepProgress);
      }

      // Mark current step as completed
      setSteps(prev => prev.map(step =>
        step.id === currentStep.id
          ? { 
              ...step, 
              status: "completed", 
              progress: 100,
              message: getCompletedMessage(currentStep.id)
            }
          : step
      ));

      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsAnalyzing(false);
    setOverallProgress(100);
  };

  const getCompletedMessage = (stepId: string): string => {
    const messages: Record<string, string> = {
      "url-validation": "✅ Product URL validated successfully",
      "product-extraction": "✅ Product information extracted",
      "sustainability-check": "✅ Sustainability score: 7.5/10",
      "ethical-evaluation": "✅ Ethical rating: Good (Fair Trade Certified)",
      "price-comparison": "✅ Found 3 better deals on other platforms",
      "alternatives-search": "✅ Found 5 more sustainable alternatives"
    };
    return messages[stepId] || "✅ Step completed successfully";
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Unknown Platform';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">
                🌱 Ethical Product Analysis
              </h1>
              
              {productUrl && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <IconExternalLink size={14} />
                    {getDomainFromUrl(productUrl)}
                  </div>
                  <p className="text-sm text-gray-600 break-all max-w-md">
                    {productUrl}
                  </p>
                </div>
              )}

              {!isAnalyzing && steps.length > 0 && steps.every(s => s.status === "pending") && (
                <button 
                  onClick={simulateAnalysis}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg max-w-xs"
                >
                  🚀 Start Ethical Analysis
                </button>
              )}
            </div>
          </div>

          {/* Modern Analysis Progress */}
          {steps.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Progress</h2>
                  <div className="text-sm text-gray-500">{overallProgress}% Complete</div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  {/* eslint-disable-next-line react/forbid-dom-props */}
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'in-progress' ? 'bg-blue-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? <IconCheck size={16} /> :
                         step.status === 'in-progress' ? <IconLoader2 size={16} className="animate-spin" /> :
                         index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{step.label}</h3>
                        <p className="text-sm text-gray-600">{step.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modern Results Summary */}
          {!isAnalyzing && overallProgress === 100 && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">📊 Analysis Complete!</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <IconCheck size={14} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 mb-2">Sustainability Score: 7.5/10</h3>
                      <p className="text-green-700">
                        This product has good sustainability practices with room for improvement.
                        Consider the alternatives below for better environmental impact.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                    View Full Report
                  </button>
                  <button className="px-6 py-3 border border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                    See Alternatives
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Save to Wishlist
                  </button>
                </div>
              </div>
            </div>
          )}

          {!productUrl && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                  <IconAlertCircle size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 mb-2">No Product URL Provided</h3>
                  <p className="text-red-700">
                    Please return to the homepage and enter a product URL to analyze.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

