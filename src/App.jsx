import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Project from './components/Projects';
import Contact from './components/Contact';
import BlogPage from './components/BlogPage';
import RecentBlogs from './components/RecentBlogs';
import { Analytics } from "@vercel/analytics/react";
import FunXProjects from './components/FunXProjects'
import BirthdayRankings from './components/2025BirthdayRankings.jsx'
import HeartBot from './components/HeartBot.jsx';

function App() {
  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Project />
              <RecentBlogs />
              <FunXProjects />
              <Contact />
            </>
          }
        />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/2025-birthday-rankings" element={<BirthdayRankings />} />
        <Route path='/heartbot' element={<HeartBot/>}/>
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  );
}

export default App;
