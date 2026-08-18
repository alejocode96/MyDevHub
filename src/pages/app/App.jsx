
/**
 * @file App.jsx
 * @description componente raíz de la aplicación que configura el enrutamiento,
 * el contexto global y la estructura base de navegación Implementa React Router V6
 * con useRoutes hook para gestión declarativa de rutas.
 * @author Alejandro Galeano - AlejoCode
 * @version 1.0.0
 */

import { useState, useLayoutEffect } from 'react'
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom"

// contexto global de la aplicación
import { MyDevHubProvider, MyDevHubContext } from '../../context';
/**
 * Hook useRoutes para gestión delarativa de rutas
 * Remplaza el enfoque tradicional de <Routes>
 */

import Home from '../Home';
import AIPage from '../AIPage';
import TecnicasChat from '../TecnicasChat';

/**
 * React Router NO resetea el scroll al cambiar de ruta (a diferencia de una
 * carga de página completa) — si venías scrolleado lejos en una ruta (ej.
 * hasta MyServicesSection en Home) y navegas a otra (ej. /services/IA_Generativa
 * al hacer click en una card), la nueva página se monta pero el navegador
 * conserva ese mismo scrollY, aterrizando en medio de la página nueva en vez
 * de arriba del todo. Si la navegación trae un hash (ej. navigate('/#contactSection'))
 * se respeta y NO se fuerza el scroll a 0 — ese caso ya lo maneja Home por su cuenta.
 *
 * Dos detalles NADA obvios, encontrados perfilando el scroll frame a frame
 * (sin esto el fix se ve roto igual, aunque el código "debería" funcionar):
 *   1. useLayoutEffect, no useEffect — con useEffect el navegador ya PINTÓ
 *      un frame con el scrollY viejo recortado al alto (más corto) de la
 *      página nueva, lo que en esta app cae justo después del Hero (que
 *      mide 100vh), es decir DENTRO de ConceptosChat — por eso se veía
 *      "cargar directo en conceptos" una fracción de segundo antes de
 *      corregirse. useLayoutEffect corre antes de ese pintado.
 *   2. `scroll-behavior: smooth` está seteado globalmente en <html> — un
 *      scrollTo(0,0) normal hereda eso y anima el scroll de vuelta arriba
 *      en ~500ms, visiblemente "recorriendo" Conceptos de nuevo en el
 *      camino. Se desactiva `scroll-behavior` un instante para que este
 *      reset puntual sea instantáneo, y se restaura después.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    /**
     * Un solo scrollTo(0,0) no alcanza: justo después de montar la página
     * nueva, el layout todavía se sigue asentando (fuentes/imágenes que
     * terminan de cargar, animaciones de entrada tipo scrollytelling que
     * miden el DOM) y ese reajuste pisa el scroll que acabamos de fijar,
     * dejándolo otra vez en la posición vieja/recortada. Se re-fuerza
     * scrollTo(0,0) durante varios frames seguidos — más que suficiente
     * para ganarle a ese asentamiento — y se corta apenas se estabiliza.
     */
    let frame = 0;
    const forceTop = () => {
      window.scrollTo(0, 0);
      frame += 1;
      const stable = window.scrollY === 0;
      if (frame < 24 && !(stable && frame > 4)) {
        requestAnimationFrame(forceTop);
      } else {
        html.style.scrollBehavior = prevScrollBehavior;
      }
    };
    forceTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/services/IA_Generativa", element: <AIPage /> },
    { path: "/services/IA_Generativa/tecnicas", element: <TecnicasChat /> },
  ]);

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
};

function App() {


  return (
    <>
      <MyDevHubProvider>
        <BrowserRouter >
          <AppRoutes></AppRoutes>
        </BrowserRouter >
      </MyDevHubProvider>
    </>
  )
}

export default App
