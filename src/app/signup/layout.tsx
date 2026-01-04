import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Chatterbox Teams',
  description: 'Create your Chatterbox Teams account and start collaborating.',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
