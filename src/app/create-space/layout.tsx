export const runtime = 'edge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Space - Chatterbox Teams',
  description: 'Create a new space for your team.',
};

export default function CreateSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
