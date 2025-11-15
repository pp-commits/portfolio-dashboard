import "./globals.css";
import React from "react";

export const metadata = {
  title: "Dynamic Portfolio Dashboard",
  description: "Real-time financial dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-800 antialiased">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
