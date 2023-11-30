import { ClerkProvider } from '@clerk/nextjs';

export default function layout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
