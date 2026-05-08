import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Welcome to CloudBerry",
  description: "Gen-PVP, Survival, Events!"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
