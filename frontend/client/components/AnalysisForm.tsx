import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

interface AnalysisFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    if (text.length < 10) {
      setError("Text should be at least 10 characters long");
      return;
    }

    try {
      await onSubmit(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Analyze Message
        </CardTitle>
        <CardDescription>
          Paste an email, message, or URL content to check for potential phishing attempts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="analysis-text" className="text-sm font-medium text-slate-700">
              Text Content
            </label>
            <Textarea
              id="analysis-text"
              placeholder="Paste the email body, message, or text you want to analyze here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              className="min-h-32 resize-none placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{text.length} characters</span>
              {text.length > 0 && text.length < 10 && <span className="text-amber-600">Minimum 10 characters required</span>}
            </div>
          </div>

          {error && <div className="text-sm text-phishing bg-phishing/5 border border-phishing/20 rounded-md p-3">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze Now
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
