import React from 'react'
import './App.css'
import './TemperatureChart'
import TemperatureChart from './TemperatureChart'

function App(){
    return(
        <div>
            <h1 className="Title-text">Atria Powers</h1>
            <TemperatureChart/>
        </div>
    )
}

export default App