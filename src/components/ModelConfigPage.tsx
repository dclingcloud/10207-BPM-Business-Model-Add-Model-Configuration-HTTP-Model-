import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Pencil,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MinusCircle,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import {
  HttpModel,
  UrlRuleItem,
  HeaderRuleItem,
  PathParamRuleItem,
  BodyParamRuleItem,
  BusinessRuleItem,
  NUMBER_MODE_OPTIONS,
} from '../types/model';
import { HttpHeaderAdvancedModal, SubstringExtractionRule } from './HttpHeaderAdvancedModal';
import { RuleFieldEditModal } from './RuleFieldEditModal';

interface ModelConfigPageProps {
  initialModel?: HttpModel | null;
  onSaveModel: (model: HttpModel) => void;
  onCancel?: () => void;
  isInline?: boolean;
}

export const ModelConfigPage: React.FC<ModelConfigPageProps> = ({
  initialModel,
  onSaveModel,
  onCancel,
  isInline = false,
}) => {
  // 1. 基本信息 (要求1: 去掉模型描述)
  const [modelName, setModelName] = useState(initialModel?.name || '');
  const [modelMethod, setModelMethod] = useState(initialModel?.method || 'GET and POST');

  // 2. URL 列表
  const [urlList, setUrlList] = useState<UrlRuleItem[]>(
    initialModel?.urlList && initialModel.urlList.length > 0
      ? initialModel.urlList
      : [{ id: 'u1', url: initialModel?.pathRule || '', isRegex: false, isExclude: false }]
  );

  // 3. URL关键字 (要求3: 使用图1、图2、图3、图4、图5配置样式与下拉选项，浅色系)
  const [urlKeyword, setUrlKeyword] = useState(
    initialModel?.urlKeyword || {
      startDelim: '起始符',
      startVal: '',
      ignoreCount: 0,
      endDelim: '终止符',
      endVal: '',
      mode: '普通号',
      charset: 'UTF-8',
      enabled: false,
    }
  );

  // 4. Host 字段
  const [hostList, setHostList] = useState<string[]>(
    initialModel?.hostList && initialModel.hostList.length > 0
      ? initialModel.hostList
      : ['']
  );

  // 5. HTTP 头部字段 (要求4: 点击高级配置打开图6弹窗，参考图7浅色系)
  const [headerList, setHeaderList] = useState<HeaderRuleItem[]>(
    initialModel?.headerList && initialModel.headerList.length > 0
      ? initialModel.headerList
      : [{ id: 'h1', key: '', mode: '普通号', charset: 'UTF-8' }]
  );

  // 头部高级配置弹窗状态
  const [activeHeaderAdvancedIdx, setActiveHeaderAdvancedIdx] = useState<number | null>(null);
  const [headerExtractionRules, setHeaderExtractionRules] = useState<Record<string, SubstringExtractionRule[]>>({});

  // 6. 路径参数
  const [pathParams, setPathParams] = useState<PathParamRuleItem[]>(
    initialModel?.pathParams && initialModel.pathParams.length > 0
      ? initialModel.pathParams
      : [{ id: 'p1', key: '', value: '', mode: '普通号', charset: 'UTF-8' }]
  );

  // 7. 请求体字段列表
  const [requestBodyParams, setRequestBodyParams] = useState<BodyParamRuleItem[]>(
    initialModel?.requestBodyParams && initialModel.requestBodyParams.length > 0
      ? initialModel.requestBodyParams
      : [{ id: 'req1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]
  );

  // 8. 响应体字段列表
  const [responseBodyParams, setResponseBodyParams] = useState<BodyParamRuleItem[]>(
    initialModel?.responseBodyParams && initialModel.responseBodyParams.length > 0
      ? initialModel.responseBodyParams
      : [{ id: 'res1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]
  );

  // 脱敏规则与多维分析
  const [maskRules, setMaskRules] = useState<Record<string, string>>({
    req1: '不脱敏',
    res1: '不脱敏',
  });

  const [multiDimAnalysis, setMultiDimAnalysis] = useState<Record<string, boolean>>({
    req1: true,
    res1: true,
  });

  // 9. 业务规则
  const [businessRules, setBusinessRules] = useState<BusinessRuleItem[]>(
    initialModel?.businessRules || []
  );
  const [editingRuleFieldTarget, setEditingRuleFieldTarget] = useState<{
    ruleIdx: number;
    fieldIdx: number;
  } | null>(null);

  // 10. 性能参数
  const [perfThresholds, setPerfThresholds] = useState(
    initialModel?.perfThresholds || { enabled: false, fastMs: 500, slowMs: 2000 }
  );

  // 11. 默认业务规则
  const [defaultBizRules, setDefaultBizRules] = useState(
    initialModel?.defaultBizRules || {
      enabled: false,
      pathParam: false,
      pathCharset: 'UTF-8',
      reqBody: false,
      reqCharset: 'UTF-8',
      reqBodyLen: 1000,
      resBody: false,
      resCharset: 'UTF-8',
      resBodyLen: 1000,
    }
  );

  // 12. 全局配置 (默认增加)
  const [globalConfig, setGlobalConfig] = useState(
    initialModel?.globalConfig || {
      detailLog: '全记录',
      reqHeader: true,
    }
  );

  // 数据回显同步
  useEffect(() => {
    if (initialModel) {
      setModelName(initialModel.name);
      setModelMethod(initialModel.method);
      setUrlList(
        initialModel.urlList && initialModel.urlList.length > 0
          ? initialModel.urlList
          : [{ id: 'u1', url: initialModel.pathRule || '', isRegex: false, isExclude: false }]
      );
      setUrlKeyword(initialModel.urlKeyword);
      setHostList(initialModel.hostList.length > 0 ? initialModel.hostList : ['']);
      setHeaderList(
        initialModel.headerList.length > 0
          ? initialModel.headerList
          : [{ id: 'h1', key: '', mode: '普通号', charset: 'UTF-8' }]
      );
      setPathParams(
        initialModel.pathParams.length > 0
          ? initialModel.pathParams
          : [{ id: 'p1', key: '', value: '', mode: '普通号', charset: 'UTF-8' }]
      );
      setRequestBodyParams(
        initialModel.requestBodyParams.length > 0
          ? initialModel.requestBodyParams
          : [{ id: 'req1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]
      );
      setResponseBodyParams(
        initialModel.responseBodyParams.length > 0
          ? initialModel.responseBodyParams
          : [{ id: 'res1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]
      );
      setBusinessRules(initialModel.businessRules || []);
      setPerfThresholds(initialModel.perfThresholds);
      setDefaultBizRules(initialModel.defaultBizRules);
      setGlobalConfig(
        initialModel.globalConfig || {
          detailLog: '全记录',
          reqHeader: true,
        }
      );
    }
  }, [initialModel]);

  const [errorMessage, setErrorMessage] = useState('');

  // 重置表单
  const handleResetForm = () => {
    setModelName('');
    setModelMethod('GET and POST');
    setUrlList([{ id: 'u1', url: '', isRegex: false, isExclude: false }]);
    setUrlKeyword({
      startDelim: '起始符',
      startVal: '',
      ignoreCount: 0,
      endDelim: '终止符',
      endVal: '',
      mode: '普通号',
      charset: 'UTF-8',
      enabled: false,
    });
    setHostList(['']);
    setHeaderList([{ id: 'h1', key: '', mode: '普通号', charset: 'UTF-8' }]);
    setPathParams([{ id: 'p1', key: '', value: '', mode: '普通号', charset: 'UTF-8' }]);
    setRequestBodyParams([{ id: 'req1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]);
    setResponseBodyParams([{ id: 'res1', key: '功能号', connector: '', terminator: '终止符', terminatorVal: '', value: '', mode: '普通号', charset: 'UTF-8' }]);
    setBusinessRules([]);
    setPerfThresholds({ enabled: false, fastMs: 500, slowMs: 2000 });
    setDefaultBizRules({
      enabled: false,
      pathParam: false,
      pathCharset: 'UTF-8',
      reqBody: false,
      reqCharset: 'UTF-8',
      reqBodyLen: 1000,
      resBody: false,
      resCharset: 'UTF-8',
      resBodyLen: 1000,
    });
    setGlobalConfig({
      detailLog: '全记录',
      reqHeader: true,
    });
    setErrorMessage('');
  };

  // 保存表单
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!modelName.trim()) {
      setErrorMessage('请输入模型名称');
      return;
    }

    const firstUrl = urlList.find((u) => u.url.trim())?.url || '.*';
    const reqSummary =
      requestBodyParams
        .filter((p) => p.key.trim())
        .map((p) => `键:${p.key}; 连接符:${p.connector || ':'};终止符:${p.terminatorVal || p.terminator || ';'};值:${p.value};`)
        .join(';') || '-';
    const resSummary =
      responseBodyParams
        .filter((p) => p.key.trim())
        .map((p) => `键:${p.key}; 连接符:${p.connector || ':'};终止符:${p.terminatorVal || p.terminator || ';'};值:${p.value};`)
        .join(';') || '-';

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const modelToSave: HttpModel = {
      id: initialModel?.id || Date.now(),
      name: modelName.trim(),
      method: modelMethod,
      urlList,
      urlKeyword,
      hostList: hostList.filter((h) => h.trim()),
      headerList: headerList.filter((h) => h.key.trim()),
      pathParams: pathParams.filter((p) => p.key.trim()),
      requestBodyParams,
      responseBodyParams,
      businessRules,
      perfThresholds,
      defaultBizRules,
      globalConfig,
      pathRule: firstUrl,
      requestBodyParam: reqSummary,
      responseBodyParam: resSummary,
      createdAt: initialModel?.createdAt || formattedDate,
      description: initialModel?.description || 'HTTP 业务协议模型',
      associatedFunctionCodes: initialModel?.associatedFunctionCodes || [],
    };

    onSaveModel(modelToSave);
  };

  // 添加业务规则
  const handleAddBusinessRule = () => {
    const newRule: BusinessRuleItem = {
      id: `br_${Date.now()}`,
      name: '业务规则',
      pathParamRecord: false,
      pathParamCharset: 'UTF-8',
      reqBodyRecord: false,
      reqBodyCharset: 'UTF-8',
      reqBodyLen: 1000,
      resBodyRecord: false,
      resBodyCharset: 'UTF-8',
      resBodyLen: 1000,
      fields: [{ id: `f_${Date.now()}`, key: '', value: '' }],
      collapsed: false,
    };
    setBusinessRules([...businessRules, newRule]);
  };

  return (
    <div
      className={`bg-white text-slate-800 text-xs font-sans select-none overflow-y-auto ${
        isInline ? 'p-6 rounded-b border-t border-slate-200 shadow-sm' : 'p-6 min-h-full'
      }`}
    >
      {/* 顶部按钮栏 ([取消] [重置] [保存]) - 参考图3风格与交互 */}
      <div className="flex items-center justify-between pb-4 mb-2">
        <div className="flex items-center gap-2.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </button>
          )}
          <span className="font-semibold text-slate-900 text-sm">
            {initialModel ? `编辑模型: ${initialModel.name}` : '协议特征模型定义配置'}
          </span>
          {initialModel && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 font-mono font-medium">
              ID: {initialModel.id}
            </span>
          )}
        </div>

        {/* 顶部右侧对齐按钮 */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors"
            >
              取消
            </button>
          )}

          <button
            type="button"
            onClick={handleResetForm}
            className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors"
          >
            重置
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          >
            保存
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 表单主体 (无分割线，无模型描述，浅色系) */}
      <form onSubmit={handleSave} className="space-y-4 max-w-full">
        {/* 1. 模型名称 */}
        <div className="flex items-center gap-4 py-1">
          <label className="w-24 text-slate-700 font-medium shrink-0">模型名称</label>
          <div className="flex-1 max-w-4xl">
            <input
              type="text"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                setErrorMessage('');
              }}
              placeholder="请输入"
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs transition-colors"
            />
          </div>
        </div>

        {/* 2. 模型方法 */}
        <div className="flex items-center gap-4 py-1">
          <label className="w-24 text-slate-700 font-medium shrink-0">模型方法</label>
          <div className="flex-1 max-w-xs">
            <select
              value={modelMethod}
              onChange={(e) => setModelMethod(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
            >
              <option value="GET and POST">GET and POST</option>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
        </div>

        {/* 3. URL ? */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>URL</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 space-y-2">
            {urlList.map((item, idx) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const next = [...urlList];
                    next[idx].url = e.target.value;
                    setUrlList(next);
                  }}
                  placeholder=".*"
                  className="w-80 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />

                {/* 正则开关 */}
                <div
                  onClick={() => {
                    const next = [...urlList];
                    next[idx].isRegex = !next[idx].isRegex;
                    setUrlList(next);
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    item.isRegex ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      item.isRegex ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-slate-600 text-xs">正则</span>

                {/* 排除URL开关 */}
                <div
                  onClick={() => {
                    const next = [...urlList];
                    next[idx].isExclude = !next[idx].isExclude;
                    setUrlList(next);
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ml-2 ${
                    item.isExclude ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                      item.isExclude ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-slate-600 text-xs">排除URL</span>

                {urlList.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setUrlList(urlList.filter((_, i) => i !== idx))}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded text-xs ml-2"
                  >
                    删除
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...urlList];
                      next[idx].url = '';
                      setUrlList(next);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded text-xs ml-2"
                  >
                    清空
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setUrlList([...urlList, { id: `u_${Date.now()}`, url: '', isRegex: false, isExclude: false }])
              }
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 rounded transition-colors text-xs font-medium mt-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 4. URL关键字 (要求3: 严格对齐图1~图5配置样式与下拉选项，纯浅色系) */}
        <div className="flex items-center gap-4 py-1">
          <label className="w-24 text-slate-700 font-medium shrink-0">URL关键字</label>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 组合输入 1 (图1、图2): 起始符 / 偏移量 下拉 + 输入框 */}
            <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <select
                value={urlKeyword.startDelim}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, startDelim: e.target.value })}
                className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0"
              >
                <option value="起始符">起始符</option>
                <option value="偏移量">偏移量</option>
              </select>
              <input
                type="text"
                value={urlKeyword.startVal}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, startVal: e.target.value })}
                placeholder=""
                className="w-24 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white"
              />
            </div>

            {/* 组合输入 2 (图1): 忽略次数 标签 + 输入框 */}
            <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                忽略次数
              </span>
              <input
                type="number"
                value={urlKeyword.ignoreCount}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, ignoreCount: Number(e.target.value) })}
                className="w-16 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
              />
            </div>

            {/* 组合输入 3 (图1、图3): 终止符 / 长度 下拉 + 输入框 */}
            <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <select
                value={urlKeyword.endDelim}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, endDelim: e.target.value })}
                className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0"
              >
                <option value="终止符">终止符</option>
                <option value="长度">长度</option>
              </select>
              <input
                type="text"
                value={urlKeyword.endVal}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, endVal: e.target.value })}
                placeholder=""
                className="w-24 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white"
              />
            </div>

            {/* 下拉 4: 普通号 下拉菜单 (按图示40项完整填写) */}
            <div>
              <select
                value={urlKeyword.mode}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, mode: e.target.value })}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {NUMBER_MODE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 下拉 5 (图1、图5): UTF-8, GBK, URL Encode */}
            <div>
              <select
                value={urlKeyword.charset}
                onChange={(e) => setUrlKeyword({ ...urlKeyword, charset: e.target.value })}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="UTF-8">UTF-8</option>
                <option value="GBK">GBK</option>
                <option value="URL Encode">URL Encode</option>
              </select>
            </div>

            {/* 开关 (图1) */}
            <div className="flex items-center gap-1.5 ml-1">
              <div
                onClick={() => setUrlKeyword({ ...urlKeyword, enabled: !urlKeyword.enabled })}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  urlKeyword.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    urlKeyword.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-slate-600 text-xs">{urlKeyword.enabled ? '开启' : '关闭'}</span>
            </div>
          </div>
        </div>

        {/* 5. Host 字段 ? (统一对齐图2容器规范与图1字段交互) */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>Host 字段</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 bg-[#f8f9fa] border border-slate-200/90 rounded-md p-4 space-y-3">
            {/* 头部标题与添加操作 */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-800">
                Host 字段
              </span>
              <button
                type="button"
                onClick={() => setHostList([...hostList, ''])}
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span>添加 Host</span>
              </button>
            </div>

            {/* 分隔线与子标题 */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>Host 列表</span>
              <span>移除</span>
            </div>

            {/* 列表行 */}
            <div className="space-y-2.5">
              {hostList.map((host, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded border border-slate-200/80 shadow-2xs"
                >
                  {/* 序号方块 */}
                  <div className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-300 rounded text-slate-700 font-semibold text-xs shrink-0">
                    {idx + 1}
                  </div>

                  {/* 字段: [ Host | 输入框 ] */}
                  <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs flex-1 max-w-lg">
                    <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                      Host
                    </span>
                    <input
                      type="text"
                      value={host}
                      onChange={(e) => {
                        const next = [...hostList];
                        next[idx] = e.target.value;
                        setHostList(next);
                      }}
                      placeholder="如: api.gateway.internal"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                    />
                  </div>

                  {/* [ 清空 ] 按钮 */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...hostList];
                      next[idx] = '';
                      setHostList(next);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    清空
                  </button>

                  {/* 移除按钮 */}
                  <button
                    type="button"
                    onClick={() => {
                      if (hostList.length > 1) {
                        setHostList(hostList.filter((_, i) => i !== idx));
                      } else {
                        setHostList(['']);
                      }
                    }}
                    title="移除此项"
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 底部 [+ 添加] 虚线按钮 */}
            <div>
              <button
                type="button"
                onClick={() => setHostList([...hostList, ''])}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50/60 text-slate-600 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded text-xs transition-colors font-medium cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. HTTP 头部字段 ? (统一对齐图2容器规范与图1字段交互) */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>HTTP 头部字段</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 bg-[#f8f9fa] border border-slate-200/90 rounded-md p-4 space-y-3">
            {/* 头部标题与添加操作 */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-800">
                HTTP 头部字段
              </span>
              <button
                type="button"
                onClick={() =>
                  setHeaderList([
                    ...headerList,
                    { id: `h_${Date.now()}`, key: '', mode: '普通号', charset: 'UTF-8' },
                  ])
                }
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span>添加头部</span>
              </button>
            </div>

            {/* 分隔线与子标题 */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>头部规则定义</span>
              <span>移除</span>
            </div>

            {/* 列表行 */}
            <div className="space-y-2.5">
              {headerList.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded border border-slate-200/80 shadow-2xs"
                >
                  {/* 序号方块 */}
                  <div className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-300 rounded text-slate-700 font-semibold text-xs shrink-0">
                    {idx + 1}
                  </div>

                  {/* 字段: [ 头部名称 | 输入框 ] */}
                  <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs w-60 sm:w-72">
                    <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                      头部名称
                    </span>
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => {
                        const next = [...headerList];
                        next[idx].key = e.target.value;
                        setHeaderList(next);
                      }}
                      placeholder="如: Authorization, X-Forwarded-For"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                    />
                  </div>

                  {/* 普通号 ▾ */}
                  <select
                    value={item.mode || '普通号'}
                    onChange={(e) => {
                      const next = [...headerList];
                      next[idx].mode = e.target.value;
                      setHeaderList(next);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    {NUMBER_MODE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* UTF-8 ▾ */}
                  <select
                    value={item.charset || 'UTF-8'}
                    onChange={(e) => {
                      const next = [...headerList];
                      next[idx].charset = e.target.value;
                      setHeaderList(next);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="UTF-8">UTF-8</option>
                    <option value="GBK">GBK</option>
                    <option value="URL Encode">URL Encode</option>
                    <option value="GB2312">GB2312</option>
                    <option value="ASCII">ASCII</option>
                  </select>

                  {/* 高级配置 */}
                  <button
                    type="button"
                    onClick={() => setActiveHeaderAdvancedIdx(idx)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer font-medium"
                  >
                    高级配置
                  </button>

                  {/* 清空 */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...headerList];
                      next[idx].key = '';
                      setHeaderList(next);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    清空
                  </button>

                  {/* 移除 */}
                  <button
                    type="button"
                    onClick={() => {
                      if (headerList.length > 1) {
                        setHeaderList(headerList.filter((_, i) => i !== idx));
                      } else {
                        const next = [...headerList];
                        next[0].key = '';
                        setHeaderList(next);
                      }
                    }}
                    title="移除此项"
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 底部 [+ 添加] 虚线按钮 */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setHeaderList([
                    ...headerList,
                    { id: `h_${Date.now()}`, key: '', mode: '普通号', charset: 'UTF-8' },
                  ])
                }
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50/60 text-slate-600 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded text-xs transition-colors font-medium cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7. 路径参数 ? (统一对齐图2容器规范与图1字段交互) */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>路径参数</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 bg-[#f8f9fa] border border-slate-200/90 rounded-md p-4 space-y-3">
            {/* 头部标题与添加操作 */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-800">
                路径参数
              </span>
              <button
                type="button"
                onClick={() =>
                  setPathParams([
                    ...pathParams,
                    { id: `p_${Date.now()}`, key: '', value: '', mode: '普通号', charset: 'UTF-8' },
                  ])
                }
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span>添加参数</span>
              </button>
            </div>

            {/* 分隔线与子标题 */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>参数规则定义</span>
              <span>移除</span>
            </div>

            {/* 列表行 */}
            <div className="space-y-2.5">
              {pathParams.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded border border-slate-200/80 shadow-2xs"
                >
                  {/* 序号方块 */}
                  <div className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-300 rounded text-slate-700 font-semibold text-xs shrink-0">
                    {idx + 1}
                  </div>

                  {/* 字段 1: [ 键 | 输入框 ] */}
                  <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                    <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                      键
                    </span>
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => {
                        const next = [...pathParams];
                        next[idx].key = e.target.value;
                        setPathParams(next);
                      }}
                      placeholder=""
                      className="w-24 sm:w-28 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                    />
                  </div>

                  {/* 字段 2: [ 值 | 输入框 ✎ ] */}
                  <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs relative">
                    <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                      值
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => {
                        const next = [...pathParams];
                        next[idx].value = e.target.value;
                        setPathParams(next);
                      }}
                      placeholder=""
                      className="w-28 sm:w-36 px-2 py-1.5 pr-7 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                    />
                    <Pencil className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                  </div>

                  {/* 普通号 ▾ */}
                  <select
                    value={item.mode || '普通号'}
                    onChange={(e) => {
                      const next = [...pathParams];
                      next[idx].mode = e.target.value;
                      setPathParams(next);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    {NUMBER_MODE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* UTF-8 ▾ */}
                  <select
                    value={item.charset || 'UTF-8'}
                    onChange={(e) => {
                      const next = [...pathParams];
                      next[idx].charset = e.target.value;
                      setPathParams(next);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="UTF-8">UTF-8</option>
                    <option value="GBK">GBK</option>
                    <option value="URL Encode">URL Encode</option>
                    <option value="GB2312">GB2312</option>
                    <option value="ASCII">ASCII</option>
                  </select>

                  {/* 清空 */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...pathParams];
                      next[idx].key = '';
                      next[idx].value = '';
                      setPathParams(next);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    清空
                  </button>

                  {/* 移除 */}
                  <button
                    type="button"
                    onClick={() => {
                      if (pathParams.length > 1) {
                        setPathParams(pathParams.filter((_, i) => i !== idx));
                      } else {
                        const next = [...pathParams];
                        next[0].key = '';
                        next[0].value = '';
                        setPathParams(next);
                      }
                    }}
                    title="移除此项"
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 底部 [+ 添加] 虚线按钮 */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setPathParams([
                    ...pathParams,
                    { id: `p_${Date.now()}`, key: '', value: '', mode: '普通号', charset: 'UTF-8' },
                  ])
                }
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50/60 text-slate-600 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded text-xs transition-colors font-medium cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8. 请求体参数 (UI设计风格对齐图2，内容字段样式对齐图1) */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>请求体参数</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 bg-[#f8f9fa] border border-slate-200/90 rounded-md p-4 space-y-3">
            {/* 头部标题与添加操作 (对齐图2 UI风格) */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-800">
                请求体参数
              </span>
              <button
                type="button"
                onClick={() =>
                  setRequestBodyParams([
                    ...requestBodyParams,
                    {
                      id: `req_${Date.now()}`,
                      key: '',
                      connector: '',
                      terminator: '终止符',
                      terminatorVal: '',
                      value: '',
                      mode: '普通号',
                      charset: 'UTF-8',
                    },
                  ])
                }
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span>添加参数</span>
              </button>
            </div>

            {/* 分隔线与子标题 (对齐图2 UI风格) */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>参数列表</span>
              <span>移除</span>
            </div>

            {/* 参数列表行 (内容字段严格对齐图1样式) */}
            <div className="space-y-2.5">
              {requestBodyParams.map((item, idx) => {
                const validTerminators = ['终止符', '长度', '偏移量'];
                const currentTerminator = validTerminators.includes(item.terminator)
                  ? item.terminator
                  : '终止符';
                const currentTermVal =
                  item.terminatorVal ??
                  (!validTerminators.includes(item.terminator) ? item.terminator : '');

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded border border-slate-200/80 shadow-2xs"
                  >
                    {/* 序号方块 (对齐图2 UI风格) */}
                    <div className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-300 rounded text-slate-700 font-semibold text-xs shrink-0">
                      {idx + 1}
                    </div>

                    {/* 图1字段 1: [ 键 | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        键
                      </span>
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          const next = [...requestBodyParams];
                          next[idx].key = e.target.value;
                          setRequestBodyParams(next);
                        }}
                        placeholder=""
                        className="w-24 sm:w-28 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 2: [ 连接符 | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        连接符
                      </span>
                      <input
                        type="text"
                        value={item.connector}
                        onChange={(e) => {
                          const next = [...requestBodyParams];
                          next[idx].connector = e.target.value;
                          setRequestBodyParams(next);
                        }}
                        placeholder=""
                        className="w-20 sm:w-24 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 3: [ 终止符 ▾ | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <select
                        value={currentTerminator}
                        onChange={(e) => {
                          const next = [...requestBodyParams];
                          next[idx].terminator = e.target.value;
                          setRequestBodyParams(next);
                        }}
                        className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0 font-medium"
                      >
                        <option value="终止符">终止符</option>
                        <option value="长度">长度</option>
                        <option value="偏移量">偏移量</option>
                      </select>
                      <input
                        type="text"
                        value={currentTermVal}
                        onChange={(e) => {
                          const next = [...requestBodyParams];
                          next[idx].terminatorVal = e.target.value;
                          setRequestBodyParams(next);
                        }}
                        placeholder=""
                        className="w-20 sm:w-24 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 4: [ 值 | 输入框 ✎ ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs relative">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        值
                      </span>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const next = [...requestBodyParams];
                          next[idx].value = e.target.value;
                          setRequestBodyParams(next);
                        }}
                        placeholder=""
                        className="w-24 sm:w-28 px-2 py-1.5 pr-7 text-xs text-slate-800 focus:outline-none bg-white"
                      />
                      <Pencil className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                    </div>

                    {/* 图1字段 5: [ 普通号 ▾ ] */}
                    <select
                      value={item.mode || '普通号'}
                      onChange={(e) => {
                        const next = [...requestBodyParams];
                        next[idx].mode = e.target.value;
                        setRequestBodyParams(next);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      {NUMBER_MODE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {/* 图1字段 6: [ UTF-8 ▾ ] */}
                    <select
                      value={item.charset || 'UTF-8'}
                      onChange={(e) => {
                        const next = [...requestBodyParams];
                        next[idx].charset = e.target.value;
                        setRequestBodyParams(next);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      <option value="UTF-8">UTF-8</option>
                      <option value="GBK">GBK</option>
                      <option value="URL Encode">URL Encode</option>
                      <option value="GB2312">GB2312</option>
                      <option value="ASCII">ASCII</option>
                    </select>

                    {/* 图1字段 7: [ 清空 ] 按钮 */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...requestBodyParams];
                        next[idx].key = '';
                        next[idx].connector = '';
                        next[idx].terminatorVal = '';
                        next[idx].value = '';
                        setRequestBodyParams(next);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      清空
                    </button>

                    {/* 图2风格: 移除按钮 (MinusCircle) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (requestBodyParams.length > 1) {
                          setRequestBodyParams(requestBodyParams.filter((_, i) => i !== idx));
                        } else {
                          const next = [...requestBodyParams];
                          next[0].key = '';
                          next[0].connector = '';
                          next[0].terminatorVal = '';
                          next[0].value = '';
                          setRequestBodyParams(next);
                        }
                      }}
                      title="移除此项"
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 图1风格: 底部 [+ 添加] 虚线按钮 */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setRequestBodyParams([
                    ...requestBodyParams,
                    {
                      id: `req_${Date.now()}`,
                      key: '',
                      connector: '',
                      terminator: '终止符',
                      terminatorVal: '',
                      value: '',
                      mode: '普通号',
                      charset: 'UTF-8',
                    },
                  ])
                }
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50/60 text-slate-600 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded text-xs transition-colors font-medium cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>
        </div>

        {/* 9. 返回体参数 (UI设计风格对齐图2，内容字段样式对齐图1) */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>返回体参数</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 bg-[#f8f9fa] border border-slate-200/90 rounded-md p-4 space-y-3">
            {/* 头部标题与添加操作 (对齐图2 UI风格) */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-800">
                返回体参数
              </span>
              <button
                type="button"
                onClick={() =>
                  setResponseBodyParams([
                    ...responseBodyParams,
                    {
                      id: `res_${Date.now()}`,
                      key: '',
                      connector: '',
                      terminator: '终止符',
                      terminatorVal: '',
                      value: '',
                      mode: '普通号',
                      charset: 'UTF-8',
                    },
                  ])
                }
                className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                <span>添加参数</span>
              </button>
            </div>

            {/* 分隔线与子标题 (对齐图2 UI风格) */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>参数列表</span>
              <span>移除</span>
            </div>

            {/* 参数列表行 (内容字段严格对齐图1样式) */}
            <div className="space-y-2.5">
              {responseBodyParams.map((item, idx) => {
                const validTerminators = ['终止符', '长度', '偏移量'];
                const currentTerminator = validTerminators.includes(item.terminator)
                  ? item.terminator
                  : '终止符';
                const currentTermVal =
                  item.terminatorVal ??
                  (!validTerminators.includes(item.terminator) ? item.terminator : '');

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-2.5 p-2 bg-white rounded border border-slate-200/80 shadow-2xs"
                  >
                    {/* 序号方块 (对齐图2 UI风格) */}
                    <div className="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-300 rounded text-slate-700 font-semibold text-xs shrink-0">
                      {idx + 1}
                    </div>

                    {/* 图1字段 1: [ 键 | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        键
                      </span>
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          const next = [...responseBodyParams];
                          next[idx].key = e.target.value;
                          setResponseBodyParams(next);
                        }}
                        placeholder=""
                        className="w-24 sm:w-28 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 2: [ 连接符 | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        连接符
                      </span>
                      <input
                        type="text"
                        value={item.connector}
                        onChange={(e) => {
                          const next = [...responseBodyParams];
                          next[idx].connector = e.target.value;
                          setResponseBodyParams(next);
                        }}
                        placeholder=""
                        className="w-20 sm:w-24 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 3: [ 终止符 ▾ | 输入框 ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
                      <select
                        value={currentTerminator}
                        onChange={(e) => {
                          const next = [...responseBodyParams];
                          next[idx].terminator = e.target.value;
                          setResponseBodyParams(next);
                        }}
                        className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0 font-medium"
                      >
                        <option value="终止符">终止符</option>
                        <option value="长度">长度</option>
                        <option value="偏移量">偏移量</option>
                      </select>
                      <input
                        type="text"
                        value={currentTermVal}
                        onChange={(e) => {
                          const next = [...responseBodyParams];
                          next[idx].terminatorVal = e.target.value;
                          setResponseBodyParams(next);
                        }}
                        placeholder=""
                        className="w-20 sm:w-24 px-2 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    {/* 图1字段 4: [ 值 | 输入框 ✎ ] */}
                    <div className="flex items-center rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs relative">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        值
                      </span>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const next = [...responseBodyParams];
                          next[idx].value = e.target.value;
                          setResponseBodyParams(next);
                        }}
                        placeholder=""
                        className="w-24 sm:w-28 px-2 py-1.5 pr-7 text-xs text-slate-800 focus:outline-none bg-white"
                      />
                      <Pencil className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                    </div>

                    {/* 图1字段 5: [ 普通号 ▾ ] */}
                    <select
                      value={item.mode || '普通号'}
                      onChange={(e) => {
                        const next = [...responseBodyParams];
                        next[idx].mode = e.target.value;
                        setResponseBodyParams(next);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      {NUMBER_MODE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {/* 图1字段 6: [ UTF-8 ▾ ] */}
                    <select
                      value={item.charset || 'UTF-8'}
                      onChange={(e) => {
                        const next = [...responseBodyParams];
                        next[idx].charset = e.target.value;
                        setResponseBodyParams(next);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      <option value="UTF-8">UTF-8</option>
                      <option value="GBK">GBK</option>
                      <option value="URL Encode">URL Encode</option>
                      <option value="GB2312">GB2312</option>
                      <option value="ASCII">ASCII</option>
                    </select>

                    {/* 图1字段 7: [ 清空 ] 按钮 */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...responseBodyParams];
                        next[idx].key = '';
                        next[idx].connector = '';
                        next[idx].terminatorVal = '';
                        next[idx].value = '';
                        setResponseBodyParams(next);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      清空
                    </button>

                    {/* 图2风格: 移除按钮 (MinusCircle) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (responseBodyParams.length > 1) {
                          setResponseBodyParams(responseBodyParams.filter((_, i) => i !== idx));
                        } else {
                          const next = [...responseBodyParams];
                          next[0].key = '';
                          next[0].connector = '';
                          next[0].terminatorVal = '';
                          next[0].value = '';
                          setResponseBodyParams(next);
                        }
                      }}
                      title="移除此项"
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 图1风格: 底部 [+ 添加] 虚线按钮 */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setResponseBodyParams([
                    ...responseBodyParams,
                    {
                      id: `res_${Date.now()}`,
                      key: '',
                      connector: '',
                      terminator: '终止符',
                      terminatorVal: '',
                      value: '',
                      mode: '普通号',
                      charset: 'UTF-8',
                    },
                  ])
                }
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50/60 text-slate-600 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded text-xs transition-colors font-medium cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>
        </div>

        {/* 10. 业务规则 ? */}
        <div className="flex items-start gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0 pt-1.5">
            <span>业务规则</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex-1 space-y-3">
            {businessRules.map((rule, ruleIdx) => (
              <div
                key={rule.id}
                className="bg-[#f5f6f8] border border-slate-200/90 rounded overflow-hidden"
              >
                <div className="px-4 py-2 bg-slate-100 flex items-center justify-between text-xs font-medium text-slate-800 border-b border-slate-200">
                  <div
                    onClick={() => {
                      const next = [...businessRules];
                      next[ruleIdx].collapsed = !next[ruleIdx].collapsed;
                      setBusinessRules(next);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                  >
                    {rule.collapsed ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{rule.name || '业务规则'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBusinessRules(businessRules.filter((_, i) => i !== ruleIdx))}
                    className="px-2.5 py-0.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded text-[11px] transition-colors"
                  >
                    删除
                  </button>
                </div>

                {!rule.collapsed && (
                  <div className="p-4 space-y-3 bg-[#fafbfc] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-700 shrink-0">规则名称:</span>
                      <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => {
                          const next = [...businessRules];
                          next[ruleIdx].name = e.target.value;
                          setBusinessRules(next);
                        }}
                        className="w-48 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                      />
                      <span className="text-slate-400 text-[11px]">注:在此更改业务规则名称</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-slate-700 pt-1">
                      <span className="text-slate-500 shrink-0">字段记录:</span>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={rule.pathParamRecord}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].pathParamRecord = e.target.checked;
                            setBusinessRules(next);
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>路径参数</span>
                        <select
                          value={rule.pathParamCharset}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].pathParamCharset = e.target.value;
                            setBusinessRules(next);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="UTF-8">UTF-8</option>
                          <option value="GBK">GBK</option>
                          <option value="URL Encode">URL Encode</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={rule.reqBodyRecord}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].reqBodyRecord = e.target.checked;
                            if (e.target.checked && !next[ruleIdx].reqBodyLen) {
                              next[ruleIdx].reqBodyLen = 1000;
                            }
                            setBusinessRules(next);
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>请求体</span>
                        <select
                          value={rule.reqBodyCharset}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].reqBodyCharset = e.target.value;
                            setBusinessRules(next);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="UTF-8">UTF-8</option>
                          <option value="GBK">GBK</option>
                          <option value="URL Encode">URL Encode</option>
                        </select>
                        {rule.reqBodyRecord && (
                          <div className="flex items-center gap-1 ml-1">
                            <span className="text-slate-500">长度</span>
                            <input
                              type="number"
                              value={rule.reqBodyLen ?? 1000}
                              onChange={(e) => {
                                const next = [...businessRules];
                                next[ruleIdx].reqBodyLen = Number(e.target.value);
                                setBusinessRules(next);
                              }}
                              className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 text-xs text-center"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={rule.resBodyRecord}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].resBodyRecord = e.target.checked;
                            if (e.target.checked && !next[ruleIdx].resBodyLen) {
                              next[ruleIdx].resBodyLen = 1000;
                            }
                            setBusinessRules(next);
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>返回体</span>
                        <select
                          value={rule.resBodyCharset}
                          onChange={(e) => {
                            const next = [...businessRules];
                            next[ruleIdx].resBodyCharset = e.target.value;
                            setBusinessRules(next);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="UTF-8">UTF-8</option>
                          <option value="GBK">GBK</option>
                          <option value="URL Encode">URL Encode</option>
                        </select>
                        {rule.resBodyRecord && (
                          <div className="flex items-center gap-1 ml-1">
                            <span className="text-slate-500">长度</span>
                            <input
                              type="number"
                              value={rule.resBodyLen ?? 1000}
                              onChange={(e) => {
                                const next = [...businessRules];
                                next[ruleIdx].resBodyLen = Number(e.target.value);
                                setBusinessRules(next);
                              }}
                              className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 text-xs text-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {rule.fields.map((f, fIdx) => (
                        <div key={f.id} className="flex flex-wrap items-center gap-2">
                          <span className="text-slate-600 shrink-0">字段定义:</span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 text-xs">
                            键
                          </span>
                          <input
                            type="text"
                            value={f.key}
                            onChange={(e) => {
                              const next = [...businessRules];
                              next[ruleIdx].fields[fIdx].key = e.target.value;
                              setBusinessRules(next);
                            }}
                            className="w-48 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                          />

                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 text-xs">
                            值
                          </span>
                          <input
                            type="text"
                            value={f.value}
                            onChange={(e) => {
                              const next = [...businessRules];
                              next[ruleIdx].fields[fIdx].value = e.target.value;
                              setBusinessRules(next);
                            }}
                            className="w-48 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                          />

                          <button
                            type="button"
                            onClick={() => setEditingRuleFieldTarget({ ruleIdx, fieldIdx: fIdx })}
                            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-300 rounded text-xs transition-colors cursor-pointer shadow-2xs font-medium"
                          >
                            编辑
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const next = [...businessRules];
                              next[ruleIdx].fields[fIdx].key = '';
                              next[ruleIdx].fields[fIdx].value = '';
                              setBusinessRules(next);
                            }}
                            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded text-xs"
                          >
                            清空
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const next = [...businessRules];
                          next[ruleIdx].fields.push({ id: `f_${Date.now()}`, key: '', value: '' });
                          setBusinessRules(next);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 rounded text-xs mt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>添加</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddBusinessRule}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 rounded text-xs font-medium shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 11. 性能参数 ? */}
        <div className="flex items-center gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0">
            <span>性能参数</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              onClick={() => setPerfThresholds({ ...perfThresholds, enabled: !perfThresholds.enabled })}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                perfThresholds.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  perfThresholds.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-slate-600 text-xs">
              {perfThresholds.enabled ? '开启' : '关闭'}
            </span>

            <span className="text-slate-500 pl-3">快速 ≤</span>
            <input
              type="number"
              value={perfThresholds.fastMs}
              onChange={(e) => setPerfThresholds({ ...perfThresholds, fastMs: Number(e.target.value) })}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs font-mono"
            />
            <span className="text-slate-500">毫秒 ≤ 缓慢 ≤</span>
            <input
              type="number"
              value={perfThresholds.slowMs}
              onChange={(e) => setPerfThresholds({ ...perfThresholds, slowMs: Number(e.target.value) })}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs font-mono"
            />
            <span className="text-slate-500">毫秒 ≤ 极慢</span>
          </div>
        </div>

        {/* 12. 默认业务规则 ? */}
        <div className="flex items-center gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0">
            <span>默认业务规则</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={defaultBizRules.enabled}
                onChange={(e) => setDefaultBizRules({ ...defaultBizRules, enabled: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
              />
              <span className="text-slate-700 font-medium">启用</span>
            </label>

            <div className="flex flex-wrap items-center gap-4 text-slate-700">
              <span className="text-slate-500">字段记录:</span>

              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={defaultBizRules.pathParam}
                  onChange={(e) => setDefaultBizRules({ ...defaultBizRules, pathParam: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
                />
                <span>路径参数</span>
                <select
                  value={defaultBizRules.pathCharset}
                  onChange={(e) => setDefaultBizRules({ ...defaultBizRules, pathCharset: e.target.value })}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="URL Encode">URL Encode</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={defaultBizRules.reqBody}
                  onChange={(e) =>
                    setDefaultBizRules({
                      ...defaultBizRules,
                      reqBody: e.target.checked,
                      reqBodyLen: e.target.checked ? (defaultBizRules.reqBodyLen ?? 1000) : defaultBizRules.reqBodyLen,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
                />
                <span>请求体</span>
                <select
                  value={defaultBizRules.reqCharset}
                  onChange={(e) => setDefaultBizRules({ ...defaultBizRules, reqCharset: e.target.value })}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="URL Encode">URL Encode</option>
                </select>
                {defaultBizRules.reqBody && (
                  <div className="flex items-center gap-1 ml-1">
                    <span className="text-slate-500">长度</span>
                    <input
                      type="number"
                      value={defaultBizRules.reqBodyLen ?? 1000}
                      onChange={(e) =>
                        setDefaultBizRules({
                          ...defaultBizRules,
                          reqBodyLen: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 text-xs text-center"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={defaultBizRules.resBody}
                  onChange={(e) =>
                    setDefaultBizRules({
                      ...defaultBizRules,
                      resBody: e.target.checked,
                      resBodyLen: e.target.checked ? (defaultBizRules.resBodyLen ?? 1000) : defaultBizRules.resBodyLen,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
                />
                <span>返回体</span>
                <select
                  value={defaultBizRules.resCharset}
                  onChange={(e) => setDefaultBizRules({ ...defaultBizRules, resCharset: e.target.value })}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="URL Encode">URL Encode</option>
                </select>
                {defaultBizRules.resBody && (
                  <div className="flex items-center gap-1 ml-1">
                    <span className="text-slate-500">长度</span>
                    <input
                      type="number"
                      value={defaultBizRules.resBodyLen ?? 1000}
                      onChange={(e) =>
                        setDefaultBizRules({
                          ...defaultBizRules,
                          resBodyLen: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 text-xs text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 13. 全局配置 (默认增加) */}
        <div className="flex items-center gap-4 py-1">
          <div className="w-24 flex items-center gap-1 text-slate-700 font-medium shrink-0">
            <span>全局配置</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">详单记录:</span>
              <select
                value={globalConfig.detailLog}
                onChange={(e) => setGlobalConfig({ ...globalConfig, detailLog: e.target.value })}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="全记录">全记录</option>
                <option value="不记录">不记录</option>
                <option value="异常记录">异常记录</option>
                <option value="慢交易记录">慢交易记录</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={globalConfig.reqHeader}
                onChange={(e) => setGlobalConfig({ ...globalConfig, reqHeader: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
              />
              <span className="text-slate-700 font-medium">请求头</span>
            </label>
          </div>
        </div>

        {/* 底部保存按钮 */}
        <div className="flex items-center justify-end gap-3 pt-6 pb-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
            >
              取消
            </button>
          )}

          <button
            type="button"
            onClick={handleResetForm}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
          >
            重置
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          >
            保存
          </button>
        </div>
      </form>

      {/* HTTP 头部高级配置弹窗 (图6 & 图7) */}
      {activeHeaderAdvancedIdx !== null && (
        <HttpHeaderAdvancedModal
          isOpen={true}
          onClose={() => setActiveHeaderAdvancedIdx(null)}
          headerKey={headerList[activeHeaderAdvancedIdx]?.key || `Header_${activeHeaderAdvancedIdx + 1}`}
          initialRules={headerExtractionRules[headerList[activeHeaderAdvancedIdx]?.id || '']}
          onSave={(rules) => {
            const hId = headerList[activeHeaderAdvancedIdx]?.id || '';
            setHeaderExtractionRules({
              ...headerExtractionRules,
              [hId]: rules,
            });
            setActiveHeaderAdvancedIdx(null);
          }}
        />
      )}

      {/* 业务规则字段定义编辑弹窗 (图1逻辑内容与高级配置弹窗浅色样式) */}
      {editingRuleFieldTarget !== null && (
        <RuleFieldEditModal
          isOpen={true}
          onClose={() => setEditingRuleFieldTarget(null)}
          initialKey={
            businessRules[editingRuleFieldTarget.ruleIdx]?.fields[
              editingRuleFieldTarget.fieldIdx
            ]?.key || ''
          }
          initialValue={
            businessRules[editingRuleFieldTarget.ruleIdx]?.fields[
              editingRuleFieldTarget.fieldIdx
            ]?.value || ''
          }
          paramGroups={[
            {
              groupName: '路径参数',
              params: Array.from(
                new Set([
                  ...pathParams.map((p) => p.key).filter(Boolean),
                  '111',
                ])
              ),
            },
            {
              groupName: '请求体参数',
              params: Array.from(
                new Set([
                  ...requestBodyParams.map((p) => p.key).filter(Boolean),
                  '11122',
                ])
              ),
            },
            {
              groupName: '返回体参数',
              params: Array.from(
                new Set([
                  ...responseBodyParams.map((p) => p.key).filter(Boolean),
                ])
              ),
            },
            {
              groupName: 'HTTP 头部字段',
              params: Array.from(
                new Set([
                  ...headerList.map((h) => h.key).filter(Boolean),
                ])
              ),
            },
          ]}
          onConfirm={(key, value) => {
            const { ruleIdx, fieldIdx } = editingRuleFieldTarget;
            const next = [...businessRules];
            next[ruleIdx].fields[fieldIdx].key = key;
            next[ruleIdx].fields[fieldIdx].value = value;
            setBusinessRules(next);
            setEditingRuleFieldTarget(null);
          }}
        />
      )}
    </div>
  );
};
