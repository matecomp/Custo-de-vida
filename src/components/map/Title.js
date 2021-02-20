const titleStyle = {
  color: 'aliceblue'
}

function Title ({title="Custo de vida"}) {
  return (
    <h1 style={titleStyle}>
      {`${title} 💰`}
    </h1>
  )
}

export default Title