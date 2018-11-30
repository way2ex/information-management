import axios from 'axios';
import { Message } from 'element-ui';

// api request success callback
function successCb (res) {
  const data = res.data;
  if (data.result === 1) {
    return data.data;
  } else {
    Message.error({
      message: data.msg
    });
  }
}

// api request fail callback
function errCb (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    Message.error({ message: error.response.status });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
  } else {
    // Something happened in setting up the request that triggered an Error
    Message.error({ message: error.message });
  }
  return Promise.reject(error);
}

const methods = ['get', 'post', 'put', 'delete'];
const ajax = {};
// use mock or node server
const prefix = 'http://localhost:3001';
for (let method of methods) {
  // params in get method is including in data object
  ajax[method] = (url, data) => {
    return axios[method](prefix + url, data)
      .then(successCb)
      .catch(errCb);
  };
}
export default ajax;
