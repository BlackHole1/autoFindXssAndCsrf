import v1 from 'uuid/v1'

export const identifier: string = v1().toString().split('-')[0]

// Supported request types
// 支持的请求类型
export const supportType: string[] = [
  'main_frame',
  'script',
  'xmlhttprequest',
]

// Supported agreement
// 支持的协议
export const supportAgreement: string[] = [
  'http://*/*',
  'https://*/*'
]

// Supported ajax types
// 支持的ajax类型
export const supportMethods: string[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch'
]
