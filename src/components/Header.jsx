import { InlineIcon } from '@iconify/react'

export default function Header(props) {
    const { handleToggleMenu, darkMode, setDarkMode } = props

    return (
        <div className='header-container'>
            <header>
                <button onClick={handleToggleMenu} className='open-nav-button'>
                    <InlineIcon icon="tabler:menu-2"/>
                </button>
                <h1>Bao's Pokédex</h1>
            </header>
            <button 
                onClick={() =>{setDarkMode(!darkMode)}} 
                className='dark-mode-button open-nav-button'>
                <InlineIcon icon="tabler:sun-moon"/>
            </button>
        </div>
    )
}
