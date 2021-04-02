const fetch = require('node-fetch')

const ITEMS_API_ENPOINT =
  'https://marketplace.ifood.com.br/v2/search/catalog-items'

const transformItem = item => {
  const merchant = item.merchant || {}

  return {
    name: item.name,
    cost: item.minimumPrice || item.price,
    merchantName: merchant.name,
    deliveryCost: merchant.deliveryFee && merchant.deliveryFee.value,
    deliveryTime: merchant.deliveryTime,
    rating: merchant.userRating,
    distance: merchant.distance,
    category: merchant.mainCategory && merchant.mainCategory.name
  }
}

const filterItem = item => item.merchant && item.merchant.available

const getItems = async params => {
  try {
    const options = { method: 'GET', headers: { Accept: 'application/json' } }
    const url = new URL(ITEMS_API_ENPOINT)

    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const res = await fetch(url, options)
    const json = await res.json()
    const data = json.items.data.filter(filterItem).map(transformItem)

    return data
  } catch (err) {
    console.error(`error: ${err}`)
  }
}

const getLifeCost = async params => {
  const data = await getItems(params)
  let meanCost = data.reduce((acc, cur) => {
    acc += cur.cost
    return acc
  }, 0)
  meanCost = meanCost / data.length
  meanCost = meanCost.toFixed(2)

  return {
    meanCost: `${meanCost} R$`
  }
}

const reduceMetrics = async params => {
  const data = await getItems(params)

  const reduceKeys = {
    totalCosts: [],
    costs: [],
    deliveriesCost: [],
    deliveriesTime: [],
    distances: [],
    ratings: []
  }

  const metrics = data.reduce((acc, cur) => {
    acc.totalCosts.push(cur.cost + cur.deliveryCost)
    acc.costs.push(cur.cost)
    acc.deliveriesCost.push(cur.deliveryCost)
    acc.deliveriesTime.push(cur.deliveryTime)
    acc.distances.push(cur.distance)
    acc.ratings.push(cur.rating)
    return acc
  }, reduceKeys)

  Object.keys(metrics).map(key => metrics[key].sort((a, b) => a - b))

  console.log(metrics)

  return metrics
}

const ifoodClient = { getItems, getLifeCost, reduceMetrics }
export default ifoodClient