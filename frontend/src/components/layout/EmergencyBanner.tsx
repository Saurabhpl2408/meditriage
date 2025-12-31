import { Phone, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

export function EmergencyBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-emergency text-white py-3 px-4 animate-pulse-emergency">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-semibold">
            🚨 Critical symptoms detected. If this is a medical emergency, call 911 immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:911">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-emergency hover:bg-gray-100 font-bold gap-2"
            >
              <Phone className="h-4 w-4" />
              Call 911
            </Button>
          </a>
          <button
            className="p-1 hover:bg-white/20 rounded transition-colors"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}