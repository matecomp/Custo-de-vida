import { useState, useEffect } from 'react'
import ifoodClient from '../../client/ifood'

const parseValue = (value) => (value) ? `R$ ${value.toFixed(2)}` : 'nenhum'

const transformData = (data) => {
  const total = data.totalCosts.length;
  const minTotalCost = parseValue(data.totalCosts[0])
  const maxTotalCost = parseValue(data.totalCosts[total - 1])
  const medianTotalCost = parseValue(data.totalCosts[parseInt(total / 2)])
  const newData = {
    medianTotalCost,
    maxTotalCost,
    minTotalCost
  }
  return newData
}

const getData = async (position, term) => {
  const params = {
    latitude: position.lat,
    longitude: position.lng,
    channel: 'IFOOD',
    term,
    size: 100,
    page: 0
  }
  const data = await ifoodClient.reduceMetrics(params)
  return transformData(data)
}

const DataComponent = ({ title, data }) => (
  <div style={{
    marginLeft: '8px'
  }}>
    <h3 style={{
      textTransform: 'capitalize',
      marginTop: '0px'
    }}>{`${title}`}</h3>
    <p>{`Mínimo: ${data.minTotalCost}`}</p>
    <p>{`Mediana: ${data.medianTotalCost}`}</p>
    <p>{`Máximo: ${data.maxTotalCost}`}</p>
  </div>
)

function PlaceData({ position, terms }) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const id = `${position.lat}-${position.lng}`

  useEffect(() => {
    async function fectchData() {
      if (!data[id] || (terms.length > 0 && data[id].length !== terms.length)) {
        const newData = {}

        if (terms.length > 0) {
          setLoading(true)
          newData[id] = await Promise.all(
            terms.map(async (term) => ({
              term,
              data: await getData(position, term)
            }))
          )
          setLoading(false)
        } else {
          newData[id] = [{}]
        }

        setData(current => ({
          ...current,
          ...newData
        }))
      }
    }

    fectchData()
  }, [data, id, position, terms])

  return (
    <div key={id} style={{display: 'flex'}}>
      {data[id] && !loading
        ? data[id].map(({ term, data }) => (
          term
            ? <DataComponent title={term} data={data} />
            : <h3>Insira um termo abaixo</h3>
        ))
        : <p>Carregando</p>
      }
    </div>
  )
}

export default PlaceData
