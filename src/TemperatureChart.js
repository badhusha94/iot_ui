import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, CartesianGrid, Label } from 'recharts'
import './TemperatureChart.css'

function TemperatureChart() {
  const [chartData, setChartData] = useState([])
  const [chartMean, setChartMean] = useState(0)
  const [chartMin, setChartMin] = useState(0)
  const [chartMax, setChartMax] = useState(0)
  const [fromDatetime, setFromDate] = useState(undefined)
  const [toDatetime, setToDate] = useState(undefined)

  function handleFromDatetimeChange(event) {
    if (toDatetime !== undefined) {
      if (event.target.value >= toDatetime) {
        alert('From datetime cannot be after the To datetime!')
      }
    }
    setFromDate(event.target.value)
  }

  function handleToDatetimeChange(event) {
    if (fromDatetime !== undefined) {
      if (event.target.value <= fromDatetime) {
        alert('To datetime cannot be before the From datetime!')
      }
    }
    setToDate(event.target.value)
  }

  function onFilterApply() {
    let from = ''
    let to = ''
    let fetchurl = 'http://127.0.0.1:8000'
    if (fromDatetime !== undefined) {
      let datestart = fromDatetime.toString()
      from = 'from=' + datestart.slice(2, 4) + datestart.slice(5, 7) + datestart.slice(8, 10) + datestart.slice(11, 13) + datestart.slice(14, 16) + '00'
    }
    if (toDatetime !== undefined) {
      let dateend = toDatetime.toString()
      to = 'to=' + dateend.slice(2, 4) + dateend.slice(5, 7) + dateend.slice(8, 10) + dateend.slice(11, 13) + dateend.slice(14, 16) + '00'
    }
    if (from !== '' && to !== '') {
      if (toDatetime <= fromDatetime) {
        alert('Wrong datetime range, Deafult filter will be applied!')
      }
      else {
        fetchurl += ('?' + from + '&' + to)
      }
    }
    else if (from !== '' && to === '') {
      fetchurl += ('?' + from)
    }
    else if (from === '' && to !== '') {
      fetchurl += ('?' + to)
    }
    fetch(fetchurl).then(
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
      if(data.length===0){
        alert('No readings found for the selected time period!')
      }
      else{
        let max = data.reduce((max, obj) => max > obj.Temp ? max : obj.Temp, data[0].Temp)
        let min = data.reduce((min, obj) => min < obj.Temp ? min : obj.Temp, data[0].Temp)
        let mean = Math.round((total / data.length) * 100) / 100
        setChartData(data)
        setChartMax(max)
        setChartMin(min)
        setChartMean(mean)
      }
    })
  }

  function onFilterReset() {
    setFromDate(undefined)
    setToDate(undefined)
    onFilterApply()
  }

  useEffect(
    () => {
      onFilterApply()
    }, []
  )

  return (
    <div className="Chart-container">
      <h2 className="Chart-heading">Temperature Reading</h2>
      <div className="Chart-items-container">
        <LineChart
          width={1000}
          height={500}
          data={chartData}
          margin={{
            top: 10, right: 10, left: 10, bottom: 10,
          }}
        >
          <XAxis interval={2} name="" dataKey="Datetime" >
            <Label value="Date Time" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis scale="linear" domain={[Math.round(chartMin - 10), Math.round(chartMax + 10)]}>
            <Label value="Temperature in °C" offset={20} position="insideLeft" angle={270} />
          </YAxis>
          <Tooltip />
          <Legend align="left" height={36} />
          <CartesianGrid />
          <ReferenceLine y={chartMax} label="Max" stroke="red" />
          <ReferenceLine y={chartMean} label="Mean" stroke="yellow" />
          <ReferenceLine y={chartMin} label="Min" stroke="blue" />
          <Line name="Temperature" type="monotone" dataKey="Temp" stroke="#8884d8" />
        </LineChart>
        <form className="Filter-design">
          <br />
          <div>
            <label>From </label>
            <br />
            <input type="datetime-local" value={fromDatetime} onChange={event => { handleFromDatetimeChange(event) }} />
          </div>
          <br />
          <div>
            <label>To </label>
            <br />
            <input type="datetime-local" value={toDatetime} onChange={event => { handleToDatetimeChange(event) }} />
          </div>
          <br />
          <div className="Filter-buttons-container">
            <button className="Filter-button" name="apply" onClick={(event) => { event.preventDefault(); onFilterApply() }}>Apply</button>
            <button className="Filter-button" name="reset" onClick={(event) => { event.preventDefault(); onFilterReset() }}>Reset</button>
          </div>
          <br />
        </form>
      </div>
    </div>
  )
}

export default TemperatureChart