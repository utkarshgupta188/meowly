"use client";

import dynamic from 'next/dynamic';

const AdBlockerPopup = dynamic(() => import("@/components/AdBlockerPopup"), { ssr: false });
const PwaRegister = dynamic(() => import("@/components/PwaRegister"), { ssr: false });
const DomainRedirectPopup = dynamic(() => import("@/components/DomainRedirectPopup"), { ssr: false });
const FlyingParticles = dynamic(() => import("@/components/FlyingParticles"), { ssr: false });

const ShortcutsHUD = dynamic(() => import("@/components/ShortcutsHUD"), { ssr: false });


export default function ClientOnlyComponents() {
  return (
    <>
      <AdBlockerPopup />
      <PwaRegister />
      <DomainRedirectPopup />
      <FlyingParticles />
      <ShortcutsHUD />

    </>
  );
}
