export interface FunctionCodeField {
  id: string;
  fieldName: string;
  extractionType: string;
  expression: string;
}

export interface FunctionCodeItem {
  id?: number | string;
  code: string;
  name: string;
  description?: string;
  createdAt?: string;
  matchPattern?: string;
  latencyThresholdMs?: number;
  isKeyTransaction?: boolean;
  fields?: FunctionCodeField[];
}

export interface UrlRuleItem {
  id: string;
  url: string;
  isRegex: boolean;
  isExclude: boolean;
}

export interface HeaderRuleItem {
  id: string;
  key: string;
  mode: string;
  charset: string;
}

export interface PathParamRuleItem {
  id: string;
  key: string;
  value: string;
  mode: string;
  charset: string;
}

export interface BodyParamRuleItem {
  id: string;
  key: string;
  connector: string;
  terminator: string;
  terminatorVal?: string;
  value: string;
  mode: string;
  charset: string;
}

export interface BusinessRuleFieldDef {
  id: string;
  key: string;
  value: string;
}

export interface BusinessRuleItem {
  id: string;
  name: string;
  pathParamRecord: boolean;
  pathParamCharset: string;
  reqBodyRecord: boolean;
  reqBodyCharset: string;
  reqBodyLen?: number;
  resBodyRecord: boolean;
  resBodyCharset: string;
  resBodyLen?: number;
  fields: BusinessRuleFieldDef[];
  collapsed?: boolean;
}

export interface HttpModel {
  id: number;
  name: string;
  method: string;
  
  // URL rules (Image 1 & 3)
  urlList: UrlRuleItem[];
  
  // URL Keyword (Image 1 & 3)
  urlKeyword: {
    startDelim: string;
    startVal: string;
    ignoreCount: number;
    endDelim: string;
    endVal: string;
    mode: string;
    charset: string;
    enabled: boolean;
  };
  
  // Host rules (Image 1 & 3)
  hostList: string[];
  
  // HTTP Header fields (Image 1 & 3)
  headerList: HeaderRuleItem[];
  
  // Path params (Image 1 & 3)
  pathParams: PathParamRuleItem[];
  
  // Request body params (Image 1, 3, 4)
  requestBodyParams: BodyParamRuleItem[];
  
  // Response body params (Image 1, 2, 4)
  responseBodyParams: BodyParamRuleItem[];
  
  // Business rules (Image 4)
  businessRules?: BusinessRuleItem[];
  
  // Performance params (Image 2 & 4 & 5)
  perfThresholds: {
    enabled: boolean;
    fastMs: number;
    slowMs: number;
  };
  
  // Default biz rules (Image 2 & 5)
  defaultBizRules: {
    enabled: boolean;
    pathParam: boolean;
    pathCharset: string;
    reqBody: boolean;
    reqCharset: string;
    reqBodyLen?: number;
    resBody: boolean;
    resCharset: string;
    resBodyLen?: number;
  };
  
  // Global config (Image 2 & 5)
  globalConfig: {
    detailLog: string;
    reqHeader: boolean;
  };
  
  pathRule: string;
  requestBodyParam: string;
  responseBodyParam: string;
  
  createdAt: string;
  description?: string;
  associatedFunctionCodes: FunctionCodeItem[];
}

export interface BusinessField {
  id: string;
  key: string;
  name: string;
  type: 'string' | 'number' | 'json' | 'xml';
  isCoreIndex: boolean;
  description: string;
}

export type MenuSection = 'management' | 'modelConfig';

export type MenuItemId =
  | 'desensitization'
  | 'smartBaseline'
  | 'nodeStatistics'
  | 'httpModel'
  | 'dubbo'
  | 'appStringPattern'
  | 'unionPay'
  | 'unionPayAtm'
  | 'secondGenPay';

export const NUMBER_MODE_OPTIONS = [
  '普通号',
  '功能号',
  '追踪号',
  '渠道号',
  '子渠道号',
  '子功能号',
  '统计号1',
  '统计号2',
  '统计号3',
  '返回码',
  '字符串1',
  '字符串2',
  '字符串3',
  '字符串4',
  '字符串5',
  '字符串6',
  '字符串7',
  '字符串8',
  '字符串9',
  '字符串10',
  '字符串11',
  '字符串12',
  '字符串13',
  '字符串14',
  '字符串15',
  '整型1',
  '整型2',
  '整型3',
  '整型4',
  '整型5',
  '整型6',
  '整型7',
  '整型8',
  '整型9',
  '整型10',
  '浮点数1',
  '浮点数2',
  '浮点数3',
  '浮点数4',
  '浮点数5',
] as const;
