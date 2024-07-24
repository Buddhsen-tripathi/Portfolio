import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Project from './components/Projects'
import Contact from './components/Contact'

function App() {

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  return (
    <>
      <NavBar />
      <Hero />
      <Project />
      <Contact />
      <Footer />
    </>
  )
}

export default App