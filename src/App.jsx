import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Hero from './components/Hero';

function App() {

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  return (
    <>
    <NavBar/>
    <Hero/>
    <Footer/>
    </>
  )
}

export default App