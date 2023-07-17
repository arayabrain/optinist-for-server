import axios from 'utils/axios'

export const getExperimentsPublic = async () => {
  const response = await axios.get('/public/experiments?limit=0&offset=0')
  return response
}

export const getExperiments = async () => {
  const response = await axios.get('/db/experiments')
  return response.data
}

export const getCellsPublic = async () => {
  const response = await axios.get('/public/cells')
  return response.data
}

export const getCells = async () => {
  const response = await axios.get('/db/cells')
  return response.data
}
