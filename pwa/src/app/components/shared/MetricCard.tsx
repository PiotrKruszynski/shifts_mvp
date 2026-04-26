import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  badge?: ReactNode;
  icon: LucideIcon;
  variant: "normal" | "warning" | "critical";
}

export function MetricCard({ title, value, subtitle, badge, icon: Icon, variant }: MetricCardProps) {
  const borderStyles = {
    normal: "border-gray-200",
    warning: "border-amber-300 bg-amber-50",
    critical: "border-red-300 bg-red-50",
  };

  const iconStyles = {
    normal: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    critical: "bg-red-100 text-red-600",
  };

  return (
    <div className={`bg-white rounded-lg border ${borderStyles[variant]} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
}
