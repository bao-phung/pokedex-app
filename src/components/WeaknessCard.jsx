import React from 'react'
import { pokemonTypeColors, typeWeaknesses } from '../utils'

export default function TypeCard(props) {
    const { type } = props
    const weaknesses = typeWeaknesses?.[type] || [];

    return (
        <>
            {weaknesses.length > 0 && weaknesses.map((weakness, weaknessIndex) => {
                return (
                    <div className="type-tile"
                        key={weaknessIndex}
                        style={{
                        color: pokemonTypeColors?.[weakness]?.color,
                        background: pokemonTypeColors?.[weakness]?.background
                    }}>
                    <span class='type-name'>{weakness}</span>
                    </div>
                )
            })}
        </>
    )
}
