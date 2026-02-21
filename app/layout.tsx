import '../styles/globals.css'

export const metadata = {
  title: "HAMMA'S SHOP",
  description: 'AI-powered gaming store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6b21a8" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
