import { useGetGlobalAnnouncement } from '../hooks/useQueries';
import { AlertCircle } from 'lucide-react';

export default function GlobalAnnouncementBanner() {
  const { data: announcement } = useGetGlobalAnnouncement();

  if (!announcement || announcement.trim() === '') {
    return null;
  }

  return (
    <div className="animate-pulse border-b-2 border-neon-green bg-neon-green/10 px-4 py-3">
      <div className="container mx-auto flex items-center gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-neon-green" />
        <div className="flex-1">
          <span className="font-semibold text-neon-green">AVISO IMPORTANTE:</span>{' '}
          <span className="text-foreground">{announcement}</span>
        </div>
      </div>
    </div>
  );
}
