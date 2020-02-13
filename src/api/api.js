import axios from 'axios'

const api = axios.create({
  timeout: 8000
})

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  if(!config || !config.retry) return Promise.reject(err);
  config.__retryCount = config.__retryCount || 0;
  if(config.__retryCount >= config.retry) {
      return Promise.reject(err);
  }
  config.__retryCount += 1;
  var backOff = new Promise(function(resolve) {
      setTimeout(function() {
          resolve();
      }, config.retryDelay || 1);
  });
  return backOff.then(function() {
      return axios(config);
  });
});

export const getMaskInfo = data => {
  return api({
    url: 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
    method: 'get',
    data
  })
};

export const getCountyInfo = data => {
  return api({
    url: '/js/county.json',
    method: 'get',
    data
  })
};