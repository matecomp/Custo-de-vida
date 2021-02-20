import React, { useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'

import { Container, Box } from '@material-ui/core';
import mapStyles from './mapStyles'
import Search from './Search'
import PlaceData from './PlaceData'
import Terms from './Terms'
import Title from './Title'

const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}

const topContainerStyle = {
  position: 'absolute',
  zIndex: '1',
  top: '1rem',
  left: '50%',
  width: '90%',
  transform: 'translateX(-50%)',
  textAlign: 'center'
}

const bottomContainerStyle = {
  position: 'absolute',
  zIndex: '1',
  bottom: '2rem',
  left: '50%',
  width: '90%',
  transform: 'translateX(-50%)',
  textAlign: 'center'
}

const options = {
  styles: mapStyles,
  disableDefaultUI: true
}

const libraries = process.env.REACT_APP_GOOGLE_LIBS.split(' ')

function Map ({ center, zoom }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const [selected, setSelected] = useState(null)
  const [markers, setMakers] = useState([])
  const [terms, setTerms] = useState([])

  const handleClick = useCallback(event => {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    setMakers(current => [
      ...current,
      {
        time: new Date().toISOString(),
        position
      }
    ])
  }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback(map => {
    mapRef.current = map
  }, [])

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    setMakers(current => [
      ...current,
      {
        time: new Date().toISOString(),
        position: {
          lat,
          lng
        }
      }
    ])
    mapRef.current.setZoom(15)
  }, [])

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading Maps'

  return (
    <div className='map'>
      <Container style={topContainerStyle}>
        <Title/>
        <Box m={2} />
        <Search panTo={panTo} position={center} />
      </Container>
      
      <Container style={bottomContainerStyle}>
        <Terms updateTerms={setTerms}/>
      </Container>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        onClick={handleClick}
        onLoad={onMapLoad}
      >
        {markers.map(marker => (
          <Marker
            key={marker.time}
            position={marker.position}
            icon={{
              url: '/mark.svg',
              scaledSize: new window.google.maps.Size(40, 40),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(20,0)
            }}
            onClick={() => {
              setSelected(marker)
            }}
          ></Marker>
        ))}
        {selected ? (
          <InfoWindow
            position={selected.position}
            onCloseClick={() => setSelected(null)}
          >
            <PlaceData id={selected.time} position={selected.position} terms={terms}/>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}

export default Map
