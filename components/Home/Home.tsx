
import Hero from '../Hero/Hero';
// import Services from '../Services/Services';
import Experience from '../Experience/Experience';
import Projects from '../Projects/Projects';
import Skills from '../Skills/Skills';
// import Reviews from '../Reviews/Reviews';
import Contact from '../Contact/Contact';
// import Blogs from '../Blogs/Blogs';
import Footer from '../Footer/Footer';

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
