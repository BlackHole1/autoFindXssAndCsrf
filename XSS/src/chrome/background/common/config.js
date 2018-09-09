import v1 from 'uuid/v1'

// @flow
export const identifier: string = v1()

// Supported request types
// 支持的请求类型
export const supportType: Array<string> = [
  'main_frame',
  'script',
  'xmlhttprequest',
]

// Supported agreement
// 支持的协议
export const supportAgreement: Array<string> = [
  'http://*/*',
  'https://*/*'
]

// Supported ajax types
// 支持的ajax类型
export const supportMethods: Array<string> = [
  'get',
  'post',
  'put',
  'delete',
  'patch'
]
