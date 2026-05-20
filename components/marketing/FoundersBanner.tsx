import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FOUNDERS_PITCH_BODY, FOUNDERS_PITCH_HEADLINE } from '@/lib/copy';
import { Sparkles } from 'lucide-react';

export function FoundersBanner() {
  return (
    <Alert variant="warning" className="max-w-5xl mx-auto">
      <Sparkles className="h-4 w-4 text-accent" />
      <AlertTitle>{FOUNDERS_PITCH_HEADLINE}</AlertTitle>
      <AlertDescription>{FOUNDERS_PITCH_BODY}</AlertDescription>
    </Alert>
  );
}
