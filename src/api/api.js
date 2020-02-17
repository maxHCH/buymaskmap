import axios from 'axios'

const api = axios.create({
  timeout: 10000
})

api.defaults.retry = 4
api.defaults.retryDelay = 2000

api.interceptors.request.use(config => {
	return config
}, error => {
	console.log(error)
	Promise.reject(error)
})

api.interceptors.response.use(
	response => {
		return response
	},
	error => {
		var config = error.config;
		if (!config || !config.retry) return Promise.reject(error);
		config.__retryCount = config.__retryCount || 0;
		if (config.__retryCount >= config.retry) {
			return Promise.reject(error);
		}
		config.__retryCount += 1;
		var backOff = new Promise(resolve => setTimeout(() => resolve(), config.retryDelay || 1));
		return backOff.then(() => api(config));
	}
)

export const getMaskInfo = data => {
  return api({
    url: 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
    method: 'get',
    data
  })
};

export const getCountyInfo = data => {
  const devUrl = process.env.NODE_ENV === 'development' ? '/' : '/buymaskmap/' 
  return api({
    url: `${devUrl}js/county.json`,
    method: 'get',
    data
  })
};