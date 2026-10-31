
import "./globals.css";

export const metadata = {
  title: "SafeDev AI | Network Security, Reimagined",
  description:
    "Explore network behavior, discover meaningful patterns, and understand security insights with SafeDev AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
