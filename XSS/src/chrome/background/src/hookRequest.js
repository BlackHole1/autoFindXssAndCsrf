import { supportAgreement } from '../common/config'
import { detectionDataUniqueness$ } from '../common/utils'

export default function (cb) {
  // // The listener response should be placed before the request
  // // Because both are asynchronous, preventing the Request from being received, the Response is not received
  // // 因为两个都是异步，防止收到request后，response没有初始化，导致无法收到response
  chrome.webRequest.onBeforeRequest.addListener(
    request => {
      const { requestId } = request
      if (detectionDataUniqueness$(this, request)) {
        return false
      }
      this.requestList[requestId] = request
      

      // Because chrome's onSendHeaders API can only capture request requests, but requires data for the response request
      // So go through the onResponseStarted API to get the response request. Then merge with the request for post-processing
      // 因为chrome的onSendHeaders API只能捕获request请求，但是其实是要response请求的数据
      // 所以要通过onResponseStarted API去拿到response请求。然后与request进行合并，方便后期处理
      

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
      cb(request)

      // $flow-disable-line
    }, {
      urls: supportAgreement
    }, [
      'requestHeaders'
    ]
  )
}
