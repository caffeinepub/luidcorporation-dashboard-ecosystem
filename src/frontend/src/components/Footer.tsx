export default function Footer() {
  const appIdentifier = encodeURIComponent(window.location.hostname || 'luid-dashboard');

  return (
    <footer className="border-t border-neon-green/20 bg-carbon-black py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by LuidCloud Computing - Green Infrastructure
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built with love using{' '}
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
    </footer>
  );
}
