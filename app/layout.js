import './globals.css'

export const metadata = {
  title: 'TemRide Admin — PT Tridaya Elektra Mandiri',
  description: 'Admin Dashboard TemRide — Platform Ojek & Taksi Listrik Kalimantan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <style>{`
          * { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
        `}</style>
      </head>
      <bo>
        {children}
      </bo>
    </html>
  )
}
