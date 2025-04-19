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
              <Contact />
            </>
          }
        />
        <Route path="/blogs" element={<BlogPage />} />
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  );
}

export default App;
