import { createContext, useContext, useState } from "react"

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  const value = {
    theme,
    setTheme,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Hook personalizado (BEST PRACTICE)
export const useAppContext = () => {
  return useContext(AppContext)
}
