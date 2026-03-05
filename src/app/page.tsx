import { Hero } from '@/components/home/Hero'
import { StatsBand } from '@/components/home/StatsBand'
import { Services } from '@/components/home/Services'
import { NewsSection } from '@/components/home/NewsSection'
import { LiveRates } from '@/components/cotacao/LiveRates'
import { QuoteForm } from '@/components/home/QuoteForm'
import { ClientLogos } from '@/components/home/ClientLogos'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <Services />
      <NewsSection />
      <LiveRates />
      <ClientLogos />
      <QuoteForm />
    </>
  )
}
