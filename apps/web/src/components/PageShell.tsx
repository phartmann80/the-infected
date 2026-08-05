'use client';

import { NavHeader } from '@/components/NavHeader';
import { ProductionFooter } from '@/components/ProductionFooter';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavHeader />
      <main id="main-content" tabIndex={-1} className="page-enter">
        {children}
      </main>
      <ProductionFooter />
    </>
  );
}