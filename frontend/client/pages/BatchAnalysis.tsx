import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Menu, X, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

interface BatchResult {
  text_preview: string;
  prediction: "phishing" | "safe";
  confidence: "high" | "medium" | "low";
  reason: string;
  phishing_probability: number;
}

export default function BatchAnalysis() {
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [error, setError] = useState("");

  const handleBatchAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);

    const lines = batchText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setError("Please enter at least one line of text to analyze");
      return;
    }

    if (lines.length > 100) {
      setError("Maximum 100 texts allowed at a time");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/predict_batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts: lines }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze batch");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during batch analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    const csv = [
      ["Preview", "Prediction", "Confidence", "Phishing Probability", "Reason"].join(","),
      ...results.map((r) =>
        [
          `"${r.text_preview.replace(/"/g, '""')}"`,
          r.prediction,
          r.confidence,
          r.phishing_probability.toFixed(4),
          `"${r.reason.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phishing-analysis-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const phishingCount = results.filter((r) => r.prediction === "phishing").length;
  const safeCount = results.filter((r) => r.prediction === "safe").length;

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
              <Button variant="ghost" className="text-slate-700 bg-slate-100">
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
              <Button variant="ghost" className="w-full justify-start text-slate-700 bg-slate-100">
                Batch Analysis
              </Button>
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Batch Analysis</h1>
          <p className="text-lg text-slate-600">
            Analyze multiple emails or messages at once. Enter one text per line to check multiple items simultaneously.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Texts to Analyze</CardTitle>
                <CardDescription>One text per line (maximum 100 items)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBatchAnalysis} className="space-y-4">
                  <Textarea
                    placeholder="Enter first email...&#10;Enter second email...&#10;Enter third email..."
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    disabled={isLoading}
                    className="min-h-64 resize-none placeholder:text-slate-400 font-mono text-sm"
                  />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {batchText
                        .split("\n")
                        .filter((line) => line.trim().length > 0).length} texts to analyze
                    </span>
                    {batchText.split("\n").filter((line) => line.trim().length > 0).length > 100 && (
                      <span className="text-phishing">Maximum 100 exceeded</span>
                    )}
                  </div>

                  {error && <div className="text-sm text-phishing bg-phishing/5 border border-phishing/20 rounded-md p-3">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isLoading || batchText.trim().length === 0}
                    className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Batch"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Enter one email body per line</li>
                <li>• Supports up to 100 texts per batch</li>
                <li>• Results can be exported as CSV</li>
                <li>• Processing is instant</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-5">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Use Cases</h3>
              <p className="text-sm text-blue-800">
                Great for auditing email logs, testing security awareness training, or analyzing suspected phishing
                campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Summary */}
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{results.length}</div>
                    <div className="text-xs text-slate-600 mt-1">Total Analyzed</div>
                  </div>
                  <div className="text-center p-4 bg-phishing/5 rounded-lg border border-phishing/20">
                    <div className="text-2xl font-bold text-phishing">{phishingCount}</div>
                    <div className="text-xs text-slate-600 mt-1">Phishing Detected</div>
                  </div>
                  <div className="text-center p-4 bg-safe/5 rounded-lg border border-safe/20">
                    <div className="text-2xl font-bold text-safe">{safeCount}</div>
                    <div className="text-xs text-slate-600 mt-1">Safe Messages</div>
                  </div>
                </div>

                {phishingCount > 0 && (
                  <div className="mt-4 p-4 bg-phishing/5 border border-phishing/20 rounded-lg">
                    <p className="text-sm text-phishing font-medium">
                      ⚠️ {phishingCount} potential phishing message{phishingCount !== 1 ? "s" : ""} detected in this batch.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Detailed Results</CardTitle>
                </div>
                <Button onClick={downloadResults} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Preview</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Prediction</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Confidence</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Probability</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{result.text_preview}</td>
                          <td className="py-4 px-4">
                            <Badge
                              className={
                                result.prediction === "phishing"
                                  ? "bg-phishing/10 text-phishing border-phishing/20"
                                  : "bg-safe/10 text-safe border-safe/20"
                              }
                            >
                              {result.prediction === "phishing" ? "⚠️ Phishing" : "✓ Safe"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <ConfidenceBadge level={result.confidence} />
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-600">
                            {(result.phishing_probability * 100).toFixed(1)}%
                          </td>
                          <td className="py-4 px-4 text-slate-600 text-xs">{result.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
