export const runtime = 'edge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invite - Chatterbox Teams',
  description: 'You have been invited to join a team on Chatterbox Teams.',
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
