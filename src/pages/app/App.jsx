
/**
 * @file App.jsx
 * @description componente raíz de la aplicación que configura el enrutamiento,
 * el contexto global y la estructura base de navegación Implementa React Router V6
 * con useRoutes hook para gestión declarativa de rutas.
 * @author Alejandro Galeano - AlejoCode
 * @version 1.0.0
 */

import { useState } from 'react'
import { BrowserRouter, useRoutes } from "react-router-dom"

// contexto global de la aplicación
import { MyDevHubProvider, MyDevHubContext } from '../../context';
/**
 * Hook useRoutes para gestión delarativa de rutas
 * Remplaza el enfoque tradicional de <Routes>
 */

import Home from '../Home';
import AIPage from '../AIPage';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/services/IA_Generativa", element: <AIPage /> },
  ]);

  return routes;
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
