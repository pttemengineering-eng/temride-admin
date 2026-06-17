"use client";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>TemRide Admin</title>
        <meta name="description" content="TemRide Admin Dashboard - Manajemen Platform Ojek Online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
