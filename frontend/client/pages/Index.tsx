import { useState } from "react";
import { AnalysisForm } from "@/components/AnalysisForm";
import { ResultCard } from "@/components/ResultCard";
import { Shield, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  prediction: "phishing" | "safe";
  phishing_probability: number;
  safe_probability: number;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export default function Index() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnalysis = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze text");
      }

      const data = await response.json();
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-slate-900">PhishGuard</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className="text-slate-700">
                Detector
              </Button>
            </Link>
            <Link to="/batch">
              <Button variant="ghost" className="text-slate-700">
                Batch Analysis
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-slate-700">
                Detector
              </Button>
            </Link>
            <Link to="/batch" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-slate-700">
                Batch Analysis
              </Button>
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Phishing Email <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Detector</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced AI-powered detection using DistilBERT machine learning model. Analyze emails and messages instantly
              to identify phishing attempts with high accuracy.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <div className="text-xs text-slate-600 mt-1">Accuracy</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">Instant</div>
              <div className="text-xs text-slate-600 mt-1">Analysis</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Free</div>
              <div className="text-xs text-slate-600 mt-1">To Use</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalysisForm onSubmit={handleAnalysis} isLoading={isLoading} />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="font-semibold text-slate-900 mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Paste email or message content</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>AI analyzes for phishing indicators</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Get instant classification result</span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important</h3>
              <p className="text-sm text-amber-800">
                While this tool uses advanced ML, always verify suspicious requests through official channels and never
                share passwords or sensitive data via email.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ResultCard
              prediction={result.prediction}
              phishingProbability={result.phishing_probability}
              safeProbability={result.safe_probability}
              confidence={result.confidence}
              reason={result.reason}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 py-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Advanced Detection</h3>
              <p className="text-sm text-slate-600">
                Uses DistilBERT neural network trained on thousands of phishing examples for accurate classification.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Confidence Scoring</h3>
              <p className="text-sm text-slate-600">
                Detailed probability scores and confidence levels help you understand the detection certainty.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Batch Processing</h3>
              <p className="text-sm text-slate-600">
                Analyze multiple emails at once for security audits and compliance checks across your organization.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600">
          <p>PhishGuard © 2024. Powered by DistilBERT Machine Learning Model.</p>
        </div>
      </footer>
    </div>
  );
}
