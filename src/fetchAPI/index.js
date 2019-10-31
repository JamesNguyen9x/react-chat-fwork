import { getToken } from './cookie';
import axios from 'axios';

export default function (baseURL, url, method = 'POST', params = {}, data = null) {
  const token = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  let options = {
    url,
    method,
    baseURL,
    headers,
    params,
    data,
    timeout: 18000
  };

  return new Promise((resolve, reject) => {
    axios(options)
      .then(async response => {
        resolve(response);
      })
      .catch(function (error) {
        // if (didTimeOut) return;
        if (error.response) {
          const err = error.response;
          console.log('err', err)
          if (err.status === 401) {
          } else {
            reject(error.response);
            // return errors
            reject(err.data.errors);
          }
        }
      });
  });
}
