import { DualSelector } from "./Buttons"
import { useState } from "react"

export function HomePage() {

    let[selected, setSelected] = useState('right')

    return (<DualSelector 
        left='left'
        right='right'
        selected = {selected}
        setSelected =  {setSelected}
    />)
}