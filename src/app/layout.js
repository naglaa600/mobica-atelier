import "./globals.css";

export const metadata = {
  title: "Mobica Atelier",
  description: "Interior configurator — curated for Eng. Naglaa",
  icons: {
    icon: "/mobica-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
