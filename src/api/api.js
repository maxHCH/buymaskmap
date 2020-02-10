import axios from 'axios'

const api = axios.create({
  timeout: 5000
})


export const getMaskInfo = data => {
  return api({
    url: 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
    method: 'get',
    data
  })
};