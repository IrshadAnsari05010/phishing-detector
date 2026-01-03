import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low";
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config = {
    high: {
      icon: CheckCircle2,
      bg: "bg-emerald-100",
      text: "text-emerald-900",
      label: "High Confidence",
    },
    medium: {
      icon: HelpCircle,
      bg: "bg-amber-100",
      text: "text-amber-900",
      label: "Medium Confidence",
    },
    low: {
      icon: AlertCircle,
      bg: "bg-slate-100",
      text: "text-slate-900",
      label: "Low Confidence",
    },
  };

  const { icon: Icon, bg, text, label } = config[level];

  return (
    <Badge className={`${bg} ${text} border-0 gap-2`}>
      <Icon className="w-4 h-4" />
      {label}
    </Badge>
  );
}
