import { useAppContext } from "../../context/AppContext"

const Home = () => {
  const { theme, setTheme } = useAppContext()

  return (
    <section>
      <h1>Home</h1>
      <p>Current theme: {theme}</p>

      <button onClick={() => setTheme("dark")}>
        Switch to dark
      </button>
    </section>
  )
}

export default Home
