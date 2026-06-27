import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Welcome to CloudBerry",
  description: "Gen-PVP, Survival, Events!",
  icons: {
    icon: "/CloudBerry.png",
    shortcut: "/CloudBerry.png",
    apple: "/CloudBerry.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
