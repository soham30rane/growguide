'use client';
import './styles.css';

import { Providers } from './Providers';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="community-layout">
      <Providers>{children}</Providers>
    </div>
  );
}
