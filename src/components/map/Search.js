import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete'

import { Autocomplete } from '@material-ui/lab'
import TextInput from '../TextInput'

function Search ({ panTo, position }) {
  const {
    ready,
    suggestions: { data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => position.lat, lng: () => position.lng },
      radius: 200 * 1000
    }
  })

  const handleChange = async (address) => {
    setValue(address, false)
    clearSuggestions()
    try {
      const result = await getGeocode({address})
      const { lat, lng } = await getLatLng(result[0])
      panTo({lat, lng})
    } catch(error) {
      console.log("[Search Component] error in onSelect callback!")
    }
  }

  return (
    <Autocomplete
      id="map-search"
      options={data}
      getOptionLabel={(option) => (option.description)}
      freeSolo
      color="secondary"
      disabled={!ready}
      getOptionSelected={(option) => option.description}
      onChange={(e, option) => option && handleChange(option.description)}
      onInputChange={(e, newInputValue) => setValue(newInputValue)}
      renderInput={(params) => <TextInput placeholder="Digite um endereço" {...params} />}
    />
  )
}

export default Search