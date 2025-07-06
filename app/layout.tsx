import './globals.css';
import type { Metadata } from 'next';
import { UserProvider } from '@/providers/UserProvider';
import { Toaster } from '@/components/ui/sonner';


export const metadata: Metadata = {
  title: 'EduSpark - Educational Platform for Kids',
  description: 'Interactive learning platform for children aged 4-10 to develop reading, attention, and cognitive skills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}