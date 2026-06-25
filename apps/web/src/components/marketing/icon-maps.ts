import {
  AlertTriangle,
  FileText,
  FolderOpen,
  LineChart,
  Shield,
  Stethoscope,
  TrendingUp,
  Upload,
  type LucideIcon,
} from "lucide-react";

export const FEATURE_ICONS: Record<string, LucideIcon> = {
  timeline: TrendingUp,
  range: LineChart,
  alert: AlertTriangle,
  file: FileText,
  brief: FileText,
  caution: AlertTriangle,
  shield: Shield,
  upload: Upload,
  folder: FolderOpen,
  stethoscope: Stethoscope,
};

export const STEP_ICONS = FEATURE_ICONS;

export const ICON_STROKE = 1.75;
