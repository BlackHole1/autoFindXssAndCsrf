// @flow

import { identifier } from './common/config'
import hookRequest from './src/hookRequest'
import loadPayload from './src/loadPayload'

class findXss {
  identifier: string
  requestList: Object

  constructor () {
    this.identifier = identifier
    this.requestList = {}
    this.hookRequest()
  }

  // Listening request
  // 监听请求
  hookRequest () {
    hookRequest.call(this, request => {
      this.loadPayload(request)
    })
  }

  // Add identifier to the parameter
  // 添加identifier到参数
  loadPayload (request) {
    loadPayload.call(this, request)
  }
}

new findXss()
