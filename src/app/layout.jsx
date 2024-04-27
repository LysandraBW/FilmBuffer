import { inter } from '@/app/ui/font';
import '@/app/ui/global.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}