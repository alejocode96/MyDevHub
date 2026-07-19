import React, { useEffect } from 'react'


//componentes
import NavBar from '../../components/Home/navbar';
import HeroSection from '../../components/Home/heroSection';
import AboutSection from '../../components/Home/aboutSection';
import MyServicesSection from '../../components/Home/myServicesSection';
import ArticlesSection from '../../components/Home/articlesSection';
import ContactForm from '../../components/Home/contactForm';
import Footer from '../../components/Home/footer';

const Home = () => {
    /**Si se llega aquí con un hash (ej. navegando desde otra ruta con
     * navigate('/#contactSection')), hace scroll a esa sección al montar —
     * la navegación entre rutas de React Router no dispara el scroll nativo
     * del navegador como sí lo haría una carga de página completa. */
    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.replace('#', '');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, []);

    return (
        <>
            {/*Navbar - Menu */}
            <NavBar></NavBar>
            <main className='mb-20'>
                <HeroSection />

                <AboutSection />

                <MyServicesSection />
                <ArticlesSection />
                <ContactForm />
            </main>
            <Footer />
        </>
    )
}

export default Home
