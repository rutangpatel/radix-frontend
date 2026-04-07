import { AuthFlow } from '@/components/auth/auth-flow';

export const metadata = {
  title: 'Radix - Authentication',
  description: 'Login or create your Radix wallet account',
};

export default function AuthPage() {
  return <AuthFlow />;
}
