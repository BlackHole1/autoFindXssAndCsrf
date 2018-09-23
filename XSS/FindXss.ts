import { identifier } from './common/config'
import HookRequest from './src/HookRequest'
import LoadPayload from './src/LoadPayload'

export default class FindXss {
  private identifier: string
  private requestList: object
  
  constructor () {
    this.identifier = identifier
    this.requestList = {}
    this.hookRequest()
  }

  // Listening request
  // 监听请求
  protected hookRequest () {
    new HookRequest()
  }

  // Add identifier to the parameter
  // 添加identifier到参数
  protected loadPayload (request) {
    new LoadPayload(request)
  }

  protected get getIdentifier () {
    return this.identifier
  }

  protected get getRequestList () {
    return this.requestList
  }

  protected setRequestList (requestList) {
    this.requestList = requestList
  }

  protected setRequest (id ,body) {
    this.requestList[id] = body
  }

}

