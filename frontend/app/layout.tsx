import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer"; // 👈 1. Footer Import kiya
import 'ckeditor5/ckeditor5.css';

const geistSans = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "BharatDevops Academy",
  description: "India's Premium DevOps Learning Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-white antialiased`}>
        
        {/* Navbar screen ke upar fixed rahega */}
        <Navbar />

        <div className="flex flex-col min-h-screen">
          {/* pt-16 ensures content starts after the navbar height */}
          <main className="flex-1 pt-16">
            {children}
          </main>
          
          {/* 👈 2. Footer yahan aayega, ye hamesha screen ke bottom par aur full-width rahega */}
          <Footer />
        </div>

      </body>
    </html>
  );
}