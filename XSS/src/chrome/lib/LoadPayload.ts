import { GetUrlInfo } from '../common/utils'
import { identifier } from '../common/config'
import FindXss from '../index'
export default class LoadPayload extends FindXss {
  private request: any
  private getUrlInfo: any
  private urlInfo: any

  constructor (request: any) {
    super()
    console.log(1)
    this.request = request
    this.addPayloadToUrl()
  }

  addPayloadToUrl () {
    this.getUrlInfo = new GetUrlInfo()
    this.urlInfo = this.getUrlInfo.getInfo(this.request.url)
    if (this.urlInfo.search === '') {
      return false
    }
    const params = this.getUrlInfo.parseSearch(this.request.url)
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
    const urlPayload = this.getUrlInfo.stringifySearch(params, this.urlInfo.href)
    console.log(urlPayload)
    return true
  }
}

// export default function (request: any) {
//   const getUrlInfo = new getUrlInfo$()
//   console.log(request)
//   const urlInfo = getUrlInfo.getInfo(request.url)
//   const addPayloadToUrl = () => {
//     const params = getUrlInfo.parseSearch(request.url)
//     if (params === false) {
//       return false
//     }
//     for (let key in params) {
//       if ({}.hasOwnProperty.call(params, key)) {
//         if (params[key] === undefined) {
//           params[key] = identifier
//         } else {
//           params[key] += identifier
//         }
//       }
//     }

//     const urlPayload = getUrlInfo.stringifySearch(params, urlInfo.href)
//     // http$({
//     //   url: urlPayload,
//     //   method: request.method,
//     //   data: request.requestHeaders
//     // })
//   }

//   if (urlInfo.search !== '') {
//     addPayloadToUrl()
//   }
// }
