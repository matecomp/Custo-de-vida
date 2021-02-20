import { useState } from 'react'
import { Chip, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextInput from '../TextInput'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function Terms ({ updateTerms }) {
  const classes = useStyles();

  const [text, setText] = useState()
  const [terms, setTerms] = useState([])
  const onTextChange = (e) => {
    setText(e.target.value)
  }

  return (
    <div>
      <div className={classes.root}>
        {terms.map((term, idx) => (
            <Chip key={idx} label={term} />
          )
        )}
      </div>
      <Box m={2} />
      <TextInput 
        placeholder={'Digite seus pratos favoritos'}
        fullWidth={true}
        id='maps-terms'
        multiline={true}
        value={text}
        onChange={onTextChange}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            // Do code here
            setTerms(current => [
              ...current,
              text
            ])

            updateTerms(current => [
              ...current,
              text
            ])
            setText("")
            ev.preventDefault();
          }
        }}
      />
    </div>
  )
}

export default Terms
