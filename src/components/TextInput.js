import { TextField } from '@material-ui/core'

const termsStyle = {
  background:'white',
  fontSize: '20px',
  maxWidth: '500px',
  borderRadius: 4,
  border: 0,
  opacity: 0.7
}

function TextInput (props) {
  return (
    <TextField 
      style={termsStyle}
      variant="outlined"
      {...props}
      label={(props.value) ? null : props.label}
    />
  )
}

export default TextInput
