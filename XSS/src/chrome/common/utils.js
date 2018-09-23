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

export class GetUrlInfo {
  getInfo (urlAddress) {
    return new URL(urlAddress)
  }

  parseSearch (urlAddress) {
    if (urlAddress === null || typeof urlAddress !== 'string') {
      return false
    }

    let url = {}, search = '', params = [], paramsObj = {}
    try {
      url = new URL(urlAddress)
    } catch (e) {
      return false
    }

    search = url.search
    if (search === '' || search[0] !== '?') {
      return false
    }

    params = search.slice(1).split('&')

    
    for (let i = 0; i < params.length; i++) {
      const paramsArr = params[i].split('=')
      paramsObj[paramsArr[0]] = paramsArr[1]
    }

    return paramsObj
  }

  stringifySearch (paramsObj, href) {
    if (paramsObj === null || typeof paramsObj !== 'object') {
      return false
    }

    let params = []
    for (let key in paramsObj) {
      if ({}.hasOwnProperty.call(paramsObj, key)) {
        params.push(`${key}=${paramsObj[key]}`)
      }
    }

    if (href !== undefined) {
      let url = href.split('?')[0]
      return `${url}?${params.join('&')}`
    } else {
      return `${params.join('&')}`
    }

  }
}
