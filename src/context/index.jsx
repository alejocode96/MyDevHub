import React, { useState, useEffect, useCallback } from "react";

const MyDevHubContext = React.createContext();

function MyDevHubProvider({ children }) {

    // Tema
    const [theme, setTheme] = useState(() => {
        try { return localStorage.getItem("theme") || "light"; } catch { return "light"; }
    });

    //Efecto theme
    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.classList.toggle("dark", theme == "dark");
    }, [theme]);

    //funcion para cambio de theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        try { localStorage.setItem("theme", newTheme); } catch {/*silent */ }
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", newTheme === "dark");
        }
    }
    return (
        <MyDevHubContext.Provider
            value={{

                // Tema
                theme, setTheme, toggleTheme,
            }}
        >
            {children}
        </MyDevHubContext.Provider>
    );
}

export { MyDevHubContext, MyDevHubProvider };