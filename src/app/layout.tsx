import './globals.css';
import Providers from './providers';
import ThemeRegistry from './theme-registry';

export const metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'Frontend project with Next.js, Redux, MUI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
