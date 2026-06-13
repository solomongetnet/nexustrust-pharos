import { AppHeader } from '@/components/nexus/app-header';
import { TickerBar } from '@/components/nexus/ticker-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <TickerBar />
      {children}
    </div>
  );
}
