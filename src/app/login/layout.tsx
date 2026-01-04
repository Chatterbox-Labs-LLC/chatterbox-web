import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Chatterbox Teams',
  description: 'Sign in to your Chatterbox Teams account.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
