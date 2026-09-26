import {
  BookOpen,
  Building2,
  CalendarCheck,
  Clock,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  ShoppingCart,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons = {
  book: BookOpen,
  building: Building2,
  calendar: CalendarCheck,
  cart: ShoppingCart,
  clock: Clock,
  file: FileText,
  home: Home,
  layout: LayoutDashboard,
  list: ListChecks,
  message: MessageCircle,
  phone: Smartphone,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name];
  return <Component aria-hidden className={className} />;
}
