import { useState, useEffect } from 'react'
import ifoodClient from '../../client/ifood'

const parseValue = (value) => (value) ? `R$ ${value.toFixed(2)}` : 'nenhum'

const transformData = (data) => {
  const total  = data.totalCosts.length;
  const minTotalCost = parseValue(data.totalCosts[0])
  const maxTotalCost = parseValue(data.totalCosts[total-1])
  const medianTotalCost = parseValue(data.totalCosts[parseInt(total/2)])
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

function PlaceData ({ id, position, terms }) {
  const [data, setData] = useState({})

  useEffect(() => {
    async function fectchData() {
      if (!data[id]) {
        const newData = {}
        newData[id] = await Promise.all(
          terms.map(async (term) => ({
            term,
            data: await getData(position, term)
          }))
        )

        setData(current => ({
          ...current,
          ...newData
        }))
      }
    }
    
    fectchData()
  }, [data, id, position, terms])

  return (
    <div>
      {data[id]
        ? data[id].map((item, idx) => (
          <div key={idx}>
            <h3 style={{
              textTransform: 'capitalize',
              marginTop: '0px'
            }}>{`${item.term}`}</h3>
            <p>{`Mínimo: ${item.data.minTotalCost}`}</p>
            <p>{`Mediana: ${item.data.medianTotalCost}`}</p>
            <p>{`Máximo: ${item.data.maxTotalCost}`}</p>
          </div>
        ))
        : <p>Carregando</p>
      }
    </div>
  )
}

export default PlaceData
