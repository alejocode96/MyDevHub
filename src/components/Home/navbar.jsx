/**
 * @component navBar.jsx
 * @description Componente de barra de navegación responsive con soporte para tema
 *  claro/oscuro, menú hamburguesa en mobile, y efectos de animación startligth.
 *  incluye navegación fija superior con efecto glass morphism
 * @author Alejandro Galeano - AlejoCode
 * @version 1.0.0
 */

import React from 'react'
import { useState, useContext, useRef, useEffect } from "react"

//contexto
import { MyDevHubContext } from "../../Context";

//Iconos
import { Sun, Moon, Menu, ContactRound, CodeXml, LayersPlus, Logs, Newspaper } from "lucide-react";


//iamgenes
import logo from "../../assets/landingPage/logo.png"
const NavBar = () => {

    /**Elementos de navegación principal */
    const menuItems = [
        { name: "Sobre Mi", href: "#aboutSection" },
        { name: "Mis servicios", href: "#myServicesSection" },
        { name: "Novedades", href: "#articlesSection" },
        { name: "Contacto", href: "#contactSection" },
    ]

    return (
        <>
            {/*Contenedor principal de navegación */}
            <nav>
                <div>
                    {/**logo */}
                    <div>
                        <img src={logo} alt='Logo AlejoCode'></img>
                    </div>

                    {/**Menu desktop */}
                    <div>
                        {/**Linea efecto superior */}
                        <div><div></div></div>

                        {/**contenedor de navegación */}
                        <div></div>

                        {/**Linea efecto inferior */}
                        <div><div></div></div>
                    </div>

                    {/**boton modo dark/ligth */}
                    <button>
                        <div></div>
                    </button>

                    {/* controles mobile/table */}
                    <div>
                        <div>
                            {/**boton modo dark/ligth  */}
                            <div>
                                <div>
                                    <button>

                                    </button>
                                </div>
                            </div>

                            {/*Menú Hamburguesa */}
                            <div>
                                <div>
                                    <button></button>
                                </div>
                                <div>
                                    <button> <span>Sobre Mi</span></button>
                                    <button> <span>Mis Servicios</span></button>
                                    <button><span>Novedades</span></button>
                                    <button> <span>Contacto</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
