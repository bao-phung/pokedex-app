import Header from "./components/Header"
import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"

import { useState, useEffect } from 'react'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleMenu = () => {
    setShowSideMenu(!showSideMenu)
  }

  const handleCloseMenu = () => {
    setShowSideMenu(false)
  }

  useEffect(() => {
    if (!localStorage) { return }
    
    let dark = localStorage.getItem("darkMode");
    if(!dark) { return }

    dark = dark === "true"

    if(dark){ setDarkMode(dark) }
    
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
      localStorage.setItem("darkMode", "true")
    } else {
      document.body.classList.remove("dark-mode")
      localStorage.setItem("darkMode", "false")
    }
  }, [darkMode]);

  return (
    <>
      <SideNav
        handleCloseMenu={handleCloseMenu}
        showSideMenu={showSideMenu}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />
      <div className='pokemon-container'>
        <Header handleToggleMenu={handleToggleMenu} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        />
        <PokeCard selectedPokemon={selectedPokemon}/>
      </div>
    </>
  )
}

export default App
