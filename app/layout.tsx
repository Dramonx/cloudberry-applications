import "./globals.css";
import "./home-spacing.css";
import Header from "./components/Header";

export const metadata = {
  metadataBase: new URL("https://www.mc-cloudberry.com"),
  title: "Welcome to CloudBerry",
  description: "Gen-PVP, Survival, Events!",
  icons: {
    icon: [
      { url: "/CloudBerry.png", sizes: "1254x1254", type: "image/png" },
    ],
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
