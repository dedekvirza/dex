import React from 'react';
import {
  FolderKanban,
  SlidersHorizontal,
  FileText,
  Activity,
  Globe,
  Image,
  Terminal,
  Calculator,
  Calendar,
  ShieldCheck,
  BatteryCharging,
  Folder,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  File,
  HardDrive,
  Trash2,
  Clock,
  Sparkles,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface AppIconProps extends LucideProps {
  name: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'FolderKanban':
      return <FolderKanban {...props} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'Image':
      return <Image {...props} />;
    case 'Terminal':
      return <Terminal {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'BatteryCharging':
      return <BatteryCharging {...props} />;
    case 'Folder':
      return <Folder {...props} />;
    case 'FileCode':
      return <FileCode {...props} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'FileArchive':
      return <FileArchive {...props} />;
    case 'File':
      return <File {...props} />;
    case 'HardDrive':
      return <HardDrive {...props} />;
    case 'Trash2':
      return <Trash2 {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
