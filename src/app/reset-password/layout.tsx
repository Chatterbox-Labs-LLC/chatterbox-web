export const runtime = 'edge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Chatterbox Teams',
  description: 'Set a new password for your Chatterbox Teams account.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
