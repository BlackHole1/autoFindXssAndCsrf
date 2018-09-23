import { identifier } from './common/config'
import HookRequest from './lib/HookRequest'
import LoadPayload from './lib/LoadPayload'

export default class findXss {
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
    new HookRequest()
  }

  // Add identifier to the parameter
  // 添加identifier到参数
  loadPayload (request) {
    new LoadPayload(request)
  }

  get getIdentifier () {
    return this.identifier
  }

  get getRequestList () {
    return this.requestList
  }

  setRequestList (requestList) {
    this.requestList = requestList
  }

  setRequest (id, body) {
    this.requestList[id] = body
  }
}

new findXss()