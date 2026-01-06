export const runtime = "edge";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email - Chatterbox Teams',
  description: 'Verify your email address to get started with Chatterbox Teams.',
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
