import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Space - Chatterbox Teams',
  description: 'Join a team space on Chatterbox Teams.',
};

export default function JoinSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
