import { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import WeaknessCard from './WeaknessCard'
import Modal from './Modal'

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const {name, height, abilities, stats, types, moves, sprites } = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if(!sprites[val]){ return false }
        if(['versions', 'other'].includes(val)){ return false }
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        if(loadingSkill || !localStorage || !moveUrl){ return }

        let c = {}
        if (localStorage.getItem('pokemon-moves')){
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('Found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter
            (val => {
                return (val.version_group.name = 'firered-leafgreen' && val.language.name === 'en')
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        if (loading || !localStorage) { return }

        let cache = {}
        if(localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        if (selectedPokemon in cache){
            setData(cache[selectedPokemon])
            console.log('Found Pokemon in cache')
            return
        }

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('Fetched Pokemon data')

                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } 
            catch (err) {
                console.log(err.message)
            }
            finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div className='loading-text'>
               <h4>Catching Pokémon...</h4> 
            </div>
        )
    }
    
    return (
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Move</h6>
                        <h2 className='skill-name'>{skill.name}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
            )}
            <div>
                <h4 className='poke-number'>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2 className='poke-name'>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <img className="default-img" src={'/pokemon-sprites/0' + 
                getFullPokedexNumber(selectedPokemon) + '.png'}
                alt={`${name}-large-img`}/>
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} 
                        alt={`${name}-img-${spriteUrl}`}/>
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <span>
                                {statIndex === 0 
                                ? stat?.name.replaceAll('-', ' ').toUpperCase() 
                                : stat?.name.replaceAll('-', ' ')}:
                            </span>
                            <span style={{fontWeight: 'bold'}}>{base_stat}</span>
                        </div>
                    )
                })}
            </div>
            <h3>Weak Against</h3>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <WeaknessCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves
                .sort((a, b) => a.move.name.localeCompare(b.move.name))
                .map((moveObj, moveIndex) => {
                    return (
                        <button 
                            className='button-card pokemon-move'
                            key={moveIndex}
                            onClick={() => {
                                fetchMoveData(moveObj?.move?.name, 
                                            moveObj?.move?.url)
                            }}>
                            
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
