import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, CartesianGrid, Label } from 'recharts'
import './TemperatureChart.css'

function TemperatureChart() {
  const [chartData, setChartData] = useState([])
  const [chartMean, setChartMean] = useState(0)
  const [chartMin, setChartMin] = useState(0)
  const [chartMax, setChartMax] = useState(0)

  useEffect(
    () => {
      fetch('http://127.0.0.1:8000/').then(
        response => response.json()
      ).then((apidata) => {
        let data = []
        let total = 0
        for (let obj of apidata) {
          let date = new Date(
            parseInt(obj.reading_datetime.slice(0, 4)),
            parseInt(obj.reading_datetime.slice(5, 7)),
            parseInt(obj.reading_datetime.slice(8, 10)),
            parseInt(obj.reading_datetime.slice(11, 13)),
            parseInt(obj.reading_datetime.slice(14, 16)),
            parseInt(obj.reading_datetime.slice(17, 19))
          )
          data.push({
            'Temp': obj.reading_value,
            'Datetime': date.getMonth() + '/' +
              date.getDate() + ' ' +
              ('0' + date.getHours()).slice(-2) + ':' +
              ('0' + date.getMinutes()).slice(-2) + ':' +
              ('0' + date.getSeconds()).slice(-2)
          })
          total += obj.reading_value
        }
        let max = data.reduce((max, obj) => max > obj.Temp ? max : obj.Temp, data[0].Temp)
        let min = data.reduce((min, obj) => min < obj.Temp ? min : obj.Temp, data[0].Temp)
        let mean = Math.round((total / data.length) * 100) / 100
        console.log(max, min, mean)
        setChartData(data)
        setChartMax(max)
        setChartMin(min)
        setChartMean(mean)
      })
    }, []
  )

  return (
    <div className="Chart-container">
      <h2 className="Chart-heading">Temperature Reading</h2>
      <LineChart
        width={1000}
        height={500}
        data={chartData}
        margin={{
          top: 10, right: 10, left: 10, bottom: 10,
        }}
      >
        <XAxis name="" dataKey="Datetime" >
          <Label value="Date Time" offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Temperature in °C" offset={20} position="insideLeft" angle="270" />
        </YAxis>
        <Tooltip />
        <Legend align="left" height={36} />
        <CartesianGrid />
        <ReferenceLine y={chartMax} label="Max" stroke="red" />
        <ReferenceLine y={chartMean} label="Mean" stroke="yellow" />
        <ReferenceLine y={chartMin} label="Min" stroke="blue" />
        <Line name="Temperature" type="monotone" dataKey="Temp" stroke="#8884d8" />
      </LineChart>
    </div>
  )
}

export default TemperatureChart