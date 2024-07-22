import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function App() {

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  return (
    <>
    <NavBar/>
    <Footer/>
    </>
  )
}

export default App