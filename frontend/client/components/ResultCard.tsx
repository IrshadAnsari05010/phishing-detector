import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface ResultCardProps {
  prediction: "phishing" | "safe";
  phishingProbability: number;
  safeProbability: number;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export function ResultCard({
  prediction,
  phishingProbability,
  safeProbability,
  confidence,
  reason,
}: ResultCardProps) {
  const isPhishing = prediction === "phishing";

  return (
    <div className="space-y-4">
      <Alert className={isPhishing ? "border-phishing bg-phishing/5" : "border-safe bg-safe/5"}>
        <div className="flex items-start gap-3">
          {isPhishing ? (
            <AlertTriangle className="w-5 h-5 text-phishing mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-safe mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <AlertDescription>
              <div className="font-semibold text-base mb-1">
                {isPhishing ? "⚠️ Phishing Detected" : "✓ Message Appears Safe"}
              </div>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Analysis Results</CardTitle>
              <CardDescription>DistilBERT Model Classification</CardDescription>
            </div>
            <ConfidenceBadge level={confidence} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-phishing">Phishing Probability</span>
                <span className="text-sm font-semibold">{(phishingProbability * 100).toFixed(1)}%</span>
              </div>
              <Progress
                value={phishingProbability * 100}
                className="h-2 bg-slate-200"
                indicatorClassName="bg-phishing"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-safe">Safe Probability</span>
                <span className="text-sm font-semibold">{(safeProbability * 100).toFixed(1)}%</span>
              </div>
              <Progress
                value={safeProbability * 100}
                className="h-2 bg-slate-200"
                indicatorClassName="bg-safe"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Classification</div>
              <div className={`font-semibold ${isPhishing ? "text-phishing" : "text-safe"}`}>
                {isPhishing ? "Phishing" : "Safe"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Confidence</div>
              <div className="font-semibold capitalize">{confidence}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Margin</div>
              <div className="font-semibold">{Math.abs((phishingProbability - safeProbability) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <span className="font-medium">How to use:</span> This tool uses machine learning to detect phishing emails.
          Always exercise caution with suspicious content and verify requests through official channels.
        </AlertDescription>
      </Alert>
    </div>
  );
}
