import axios from 'axios'
import { supportType, supportMethods } from './config'

export const http$ = ({url, method, data, headers = {}}) => new Promise((resolve, reject) => {
    const methods = supportMethods

    // check if HTTP type is supported
    // 检测http类型是否支持
    if (!methods.includes(method)) {
      return reject({
        type: 'error',
        data: `[utils > http$]: The HTTP request type is not ${methods.toString()}`
      })
    }

    const axiosBaseConfig = {
      url,
      method,
      headers,
      responseType: 'text'
    }

    // need to put the data of the request type put/post/patch in the data parameter
    // 需要将请求类型put / post / patch的数据放入data参数中
    if ([ 'put', 'post', 'patch' ].includes(method)) {
      axiosBaseConfig.data = data
    }

    axios(axiosBaseConfig)
      .then(data => resolve({
        type: 'success',
        data: data.data
      }))
      .catch(() => ({
        type: 'error',
        data: '[utils > http$]: Request failed'
      }))
  })

export const detectionDataUniqueness$ = (self, request) => {
  const checkData = () => {
    const list = self.requestList
    const keys = Object.keys(list)
    let len = keys.length

    while (len--) {
      const key = keys[len]
      const currentRequest = list[key]
      const { url, type, method } = currentRequest

      if (
        url === request.url &&
        type === request.type &&
        method === request.method
      ) {
        return true
      }
    }

    return false
  }
  
  if (
    !supportType.includes(request.type) ||
    request.tabId === -1 ||
    Object.keys(self.requestList).includes(request.requestId) ||
    !supportMethods.includes(request.method.toLowerCase()) ||
    checkData()
  ) {
    return true
  }
}
