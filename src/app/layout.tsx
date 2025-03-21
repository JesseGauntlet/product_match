import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Subreddit Finder | Match Your Product with Communities",
  description: "Discover relevant subreddits for your product with AI-powered analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased bg-gradient-to-br from-white via-gray-50 to-sky-50 min-h-screen`}>
        <div className="relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 opacity-30 blur-3xl"></div>
          
          {/* Content */}
          <main className="relative">{children}</main>
          
          {/* Footer */}
          <footer className="border-t border-gray-100 py-6 mt-12">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Subreddit Discovery & Product Fit</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}