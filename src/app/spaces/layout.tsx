export const runtime = 'edge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spaces - Chatterbox Teams',
  description: 'Your team spaces and communication hubs.',
};

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
