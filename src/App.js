import { useState, useEffect } from 'react'
import Map from './components/map/Map'

const centerDefault = {
  lat: 0.0,
  lng: 0.0
}

function App () {
  const [center, setCenter] = useState(centerDefault)

  useEffect(() => navigator.geolocation.getCurrentPosition(
    position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    },
    () => null
  ), [])

  return (
    <div className='App'>
      <Map zoom={15} center={center} />
    </div>
  )
}

export default App
