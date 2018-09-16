// @flow

import { supportAgreement } from '../common/config'
import { detectionDataUniqueness$ } from '../common/utils'

export default function (cb: Function): void {
  // // The listener response should be placed before the request
  // // Because both are asynchronous, preventing the Request from being received, the Response is not received
  // // 因为两个都是异步，防止收到request后，response没有初始化，导致无法收到response
  chrome.webRequest.onBeforeRequest.addListener(
    request => {
      const requestId: string = request.requestId
      if (detectionDataUniqueness$(this, request)) {
        return false
      }
      // console.log(requestId, request)
      this.requestList[requestId] = request
      // $flow-disable-line
    }, {
      urls: supportAgreement
    },
    [ 'requestBody' ]
  )

  chrome.webRequest.onSendHeaders.addListener(
    request => {
      const { requestId, requestHeaders } = request

      // If the request is not found
      // 如果没有找到request
      if (this.requestList[requestId] === undefined) {
        return false
      }
      this.requestList[requestId].requestHeaders = requestHeaders
      cb(this.requestList[requestId])

      // $flow-disable-line
    }, {
      urls: supportAgreement
    }, [
      'requestHeaders'
    ]
    )

  // chrome.webRequest.onBeforeRequest.addListener(
  //   request => {
  //     const { requestId } = request
  //     // If the request is not found
  //     // 如果没有找到request
  //     if (this.requestList[requestId] === undefined) {
  //       return false
  //     }
  //     console.log(requestId, request)
  //   }, {
  //     urls: supportAgreement
  //   }, [
  //     'blocking', 'requestHeaders', 'requestBody'
  //   ]
  // )
}
