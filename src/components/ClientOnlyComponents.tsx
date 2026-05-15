"use client";

import dynamic from 'next/dynamic';

const AdBlockerPopup = dynamic(() => import("@/components/AdBlockerPopup"), { ssr: false });
const PwaRegister = dynamic(() => import("@/components/PwaRegister"), { ssr: false });
const DomainRedirectPopup = dynamic(() => import("@/components/DomainRedirectPopup"), { ssr: false });

export default function ClientOnlyComponents() {
  return (
    <>
      <AdBlockerPopup />
      <PwaRegister />
      <DomainRedirectPopup />
    </>
  );
}
