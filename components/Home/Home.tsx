import React from 'react';
import Hero from '../Hero/Hero';
import Services from '../Services/Services';
import Experience from '../Experience/Experience';
import Projects from '../Projects/Projects';
import Skills from '../Skills/Skills';
import Reviews from '../Reviews/Reviews';
import Footer from '../Footer/Footer';
import Contact from '../Contact/Contact';
import Blogs from '../Blogs/Blogs';

const Home = () => {
  return (
    <div
      className='px-0 md:px-0'
    >
      <Hero />
      {/* <Services /> */}
      <Experience />
      <Projects />
      <Skills />
      {/* <Reviews /> */}
      {/* <Blogs /> */}
      <Contact />
      <Footer />
    </div>
  )
}

export default Home;