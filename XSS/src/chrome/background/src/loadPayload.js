// @flow

import { getUrlInfo$, http$ } from '../common/utils'
import { identifier } from '../common/config'

export default function (request: any) {
  const getUrlInfo = new getUrlInfo$()
  console.log(request)
  const urlInfo = getUrlInfo.getInfo(request.url)
  const addPayloadToUrl = () => {
    const params = getUrlInfo.parseSearch(request.url)
    if (params === false) {
      return false
    }
    for (let key in params) {
      if ({}.hasOwnProperty.call(params, key)) {
        if (params[key] === undefined) {
          params[key] = identifier
        } else {
          params[key] += identifier
        }
      }
    }

    const urlPayload = getUrlInfo.stringifySearch(params, urlInfo.href)
    // http$({
    //   url: urlPayload,
    //   method: request.method,
    //   data: request.requestHeaders
    // })
  }

  if (urlInfo.search !== '') {
    addPayloadToUrl()
  }
}
