import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-display antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
