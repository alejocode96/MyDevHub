import React from 'react'


//componentes
import NavBar from '../../components/Home/navbar';
import HeroSection from '../../components/Home/heroSection';
import AboutSection from '../../components/Home/aboutSection';
const Home = () => {
    return (
        <>
            {/*Navbar - Menu */}
            <NavBar></NavBar>
            <main className='mb-20'>
                <HeroSection />

                <AboutSection />
            </main>
        </>
    )
}

export default Home
