
import Hero from '../Hero/Hero';
import CredibilityStrip from '../Hero/CredibilityStrip';
// import Services from '../Services/Services';
import Experience from '../Experience/Experience';
import Projects from '../Projects/Projects';
import SelectedImpact from '../Projects/SelectedImpact';
import Skills from '../Skills/Skills';
// import Reviews from '../Reviews/Reviews';
import Contact from '../Contact/Contact';
// import Blogs from '../Blogs/Blogs';
import Footer from '../Footer/Footer';

const Home = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <CredibilityStrip />
      <SelectedImpact />
      {/* <Services /> */}
      <Projects />
      <Experience />
      <Skills />
      {/* <Reviews /> */}
      {/* <Blogs /> */}
      <Contact />
      <Footer />
    </main>
  )
}

export default Home;
