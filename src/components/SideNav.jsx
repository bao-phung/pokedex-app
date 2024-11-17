import { useState, useRef } from 'react'
import { first151Pokemon, getFullPokedexNumber } from "../utils"
import { InlineIcon } from '@iconify/react'

export default function SideNav(props) {
    const { handleCloseMenu, showSideMenu, selectedPokemon, setSelectedPokemon } = props
    
    const [searchValue, setSearchValue] = useState('')

    const navRef = useRef(null)

    const filteredPokemon = first151Pokemon.filter((element, elementIndex) => {
        if (getFullPokedexNumber(elementIndex).includes(searchValue)
            || element.toLowerCase().includes(searchValue.toLowerCase())){
            return true
        }

        return false
    })

    return (
        <nav ref={navRef} className={' ' + (showSideMenu ? ' open' : '')}>
            <div className={'header ' + (showSideMenu ? ' open' : '')}>
                <button onClick={handleCloseMenu} className='open-nav-button'>
                    <InlineIcon icon="tabler:arrow-narrow-left"/>
                </button>
                <h1>Bao's Pokédex</h1>
                <button 
                    onClick={() => {navRef.current.scrollTo({ top: 0 })}} 
                    className='open-nav-button'>
                    <InlineIcon icon="tabler:arrow-bar-to-up"/>
                </button>
            </div>
            <input 
                placeholder={`Ex: '001' or 'Bulbasaur'`}
                value={searchValue} 
                onChange={(e) => {
                    setSearchValue(e.target.value)
                }}/>
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const trueIndex = first151Pokemon.indexOf(pokemon)
                
                return (
                    <button key={pokemon} className={'nav-card ' + 
                    (pokemonIndex === selectedPokemon ? 'nav-card-selected' : ' ')}
                    onClick={() => { 
                        setSelectedPokemon(trueIndex) 
                        handleCloseMenu()
                    }}>
                        <p style={{fontWeight: 'bold'}}>{getFullPokedexNumber(trueIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}
