import { useState } from 'react';
import { Heart } from 'lucide-react';
import LegalContentModal from './LegalContentModal';

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';

  return (
    <>
      <footer className="border-t border-neon-green/20 bg-carbon-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-neon-green transition-colors underline"
              >
                Termos de Uso
              </button>
              <span className="text-neon-green/30">•</span>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-neon-green transition-colors underline"
              >
                Política de Privacidade
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                LuidCorporation© {new Date().getFullYear()}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Built with <Heart className="h-3 w-3 text-neon-green fill-neon-green" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      <LegalContentModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Termos de Uso"
        type="terms"
      />

      <LegalContentModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Política de Privacidade"
        type="privacy"
      />
    </>
  );
}
