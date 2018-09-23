import { supportAgreement } from '../common/config'
import { detectionDataUniqueness$ } from '../common/utils'
import FindXss from '../index'

export default class HookRequest extends FindXss {
  constructor () {
    super()
    this.onBeforeRequest()
    this.onSendHeaders()
  }

  private onBeforeRequest () {
    chrome.webRequest.onBeforeRequest.addListener(
      request => {
        const requestId: string = request.requestId
        if (detectionDataUniqueness$(this, request)) {
          return false
        }
        this.setRequest(requestId, request)
        return true
      }, {
        urls: supportAgreement
      },
      [ 'requestBody' ]
    )
  }

  private onSendHeaders () {
    chrome.webRequest.onSendHeaders.addListener(
      request => {
        const { requestId, requestHeaders } = request
        const currentRequest = this.getRequestList[requestId]

        // If the request is not found
        // 如果没有找到request
        if (currentRequest === undefined) {
          return false
        }
        this.setRequest(requestId, Object.assign(currentRequest, {
          requestHeaders: requestHeaders
        }))
        this.loadPayload(currentRequest)
        return true
      }, {
        urls: supportAgreement
      }, [
        'requestHeaders'
      ]
    )
  }
}

// export default function (cb: (request) => void): void {
  // chrome.webRequest.onBeforeRequest.addListener(
  //   request => {
  //     const requestId: string = request.requestId
  //     if (detectionDataUniqueness$(this, request)) {
  //       return false
  //     }
  //     this.requestList[requestId] = request
  //   }, {
  //     urls: supportAgreement
  //   },
  //   [ 'requestBody' ]
  // )

  // chrome.webRequest.onSendHeaders.addListener(
  //   request => {
  //     const { requestId, requestHeaders } = request

  //     // If the request is not found
  //     // 如果没有找到request
  //     if (this.requestList[requestId] === undefined) {
  //       return false
  //     }
  //     this.requestList[requestId].requestHeaders = requestHeaders
  //     cb(this.requestList[requestId])

  //   }, {
  //     urls: supportAgreement
  //   }, [
  //     'requestHeaders'
  //   ]
  // )
// }
