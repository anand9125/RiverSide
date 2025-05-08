
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Navbar from '../components/Navbar'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage