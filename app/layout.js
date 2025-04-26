import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/context/theme-provider"
import { Toaster } from "sonner"
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ContractProvider } from '@/context/contract-context'
import { SubgraphProvider } from '@/context/graphql/queries'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PolyTix - Decentralized Voting Platform",
  description: "A blockchain-based voting platform on Polygon AMOY Testnet",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SubgraphProvider>
          <ContractProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster richColors closeButton position="top-right" />
            <Footer />
          </ContractProvider>
          </SubgraphProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}