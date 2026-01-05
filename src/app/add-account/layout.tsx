export const runtime = 'edge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Account - Chatterbox Teams',
  description: 'Add another account to your Chatterbox Teams profile.',
};

export default function AddAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
