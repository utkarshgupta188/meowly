"use client";

import dynamic from 'next/dynamic';
import VisitorTracker from '@/components/VisitorTracker';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AdBlockerPopup = dynamic(() => import("@/components/AdBlockerPopup"), { ssr: false });
const PwaRegister = dynamic(() => import("@/components/PwaRegister"), { ssr: false });
const DomainRedirectPopup = dynamic(() => import("@/components/DomainRedirectPopup"), { ssr: false });
const FlyingParticles = dynamic(() => import("@/components/FlyingParticles"), { ssr: false });

const ShortcutsHUD = dynamic(() => import("@/components/ShortcutsHUD"), { ssr: false });

export default function ClientOnlyComponents() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove existing scripts if present to ensure reload on route navigation
    const scriptIds = ['ad-network-script-1', 'ad-network-script-2', 'ad-network-script-3'];
    scriptIds.forEach(id => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    const sources = [
      { id: 'ad-network-script-1', src: '//fi.chaufergabelle.com/rnoAntQzBel2t/151988' },
      { id: 'ad-network-script-2', src: '//mr.acktontables.com/svXxFoBaWzN/153387' },
      { id: 'ad-network-script-3', src: '//ri.thlaspiyeaoman.com/iZvpfdi16luL/153388' },
    ];

    sources.forEach(({ id, src }) => {
      const script = document.createElement('script');
      script.id = id;
      script.setAttribute('data-cfasync', 'false');
      script.async = true;
      script.type = 'text/javascript';
      script.src = src;
      document.head.appendChild(script);
    });
  }, [pathname]);

  return (
    <>
      <VisitorTracker />
      <AdBlockerPopup />
      <PwaRegister />
      <DomainRedirectPopup />
      <FlyingParticles />
      <ShortcutsHUD />
    </>
  );
}
