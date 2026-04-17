/**
 * PWAInstallButton — Inline button to install VoxShield as a PWA.
 * Detects beforeinstallprompt (Android/Chrome/Edge) or iOS to show
 * appropriate install action. Hides when already installed.
 */
import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari standalone
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(iOS);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHint(true);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(null);
  };

  // Hide entirely if there's no install path available
  if (!isIOS && !installEvent) return null;

  return (
    <div className="mt-3 flex w-full max-w-xs flex-col items-center">
      <Button
        onClick={handleInstall}
        variant="outline"
        size="lg"
        className="w-full gap-2 text-base font-semibold h-14 rounded-2xl border-primary/40 bg-primary/5 hover:bg-primary/10"
      >
        {isIOS ? (
          <Smartphone className="h-5 w-5 text-primary" />
        ) : (
          <Download className="h-5 w-5 text-primary" />
        )}
        Install the App
      </Button>
      {isIOS && showIOSHint && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Tap the <span className="font-semibold">Share</span> icon, then{" "}
          <span className="font-semibold">Add to Home Screen</span>.
        </p>
      )}
    </div>
  );
}
