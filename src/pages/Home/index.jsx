import React from 'react'


//componentes
import NavBar from '../../components/Home/navbar';
import HeroSection from '../../components/Home/heroSection';
import AboutSection from '../../components/Home/aboutSection';
import MyServicesSection from '../../components/Home/myServicesSection';
import ArticlesSection from '../../components/Home/articlesSection';

const Home = () => {
    return (
        <>
            {/*Navbar - Menu */}
            <NavBar></NavBar>
            <main className='mb-20'>
                <HeroSection />

                <AboutSection />

                <MyServicesSection />
                <ArticlesSection />
            </main>
        </>
    )
}

export default Home
