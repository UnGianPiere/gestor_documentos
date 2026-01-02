import { RegisterProvider } from '@/context/register-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterProvider>
      {children}
    </RegisterProvider>
  );
}

