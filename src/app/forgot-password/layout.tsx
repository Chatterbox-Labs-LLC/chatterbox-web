import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Chatterbox Teams',
  description: 'Recover your Chatterbox Teams account password.',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
