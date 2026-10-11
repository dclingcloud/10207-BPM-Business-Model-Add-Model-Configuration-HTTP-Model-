import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle, ShieldCheck, Zap, Sliders } from 'lucide-react';

export const ModelConfigTab: React.FC = () => {
  const [charset, setCharset] = useState('UTF-8');
  const [maxPayloadKb, setMaxPayloadKb] = useState(64);
  const [timeoutMs, setTimeoutMs] = useState(3000);
  const [samplingRate, setSamplingRate] = useState(100);
  const [enableHeaderTrace, setEnableHeaderTrace] = useState(true);
  const [traceHeaderKey, setTraceHeaderKey] = useState('X-B3-TraceId, X-Request-ID');
  const [autoMaskSensitive, setAutoMaskSensitive] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl space-y-6 text-xs text-slate-700">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-800">
          HTTP 协议全局引擎解析配置
        </h3>
        <p className="text-slate-500 mt-1">
          配置适用于所有 HTTP 协议模型的网络层报文切片重组、编码识别及 Trace 全链路关联参数。
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>全局配置已成功下发至探针集群并实时生效！</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 报文解析参数 */}
          <div className="bg-slate-50/70 p-4 rounded border border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>流量探针捕获与编码规则</span>
            </h4>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                默认字符集编码
              </label>
              <select
                value={charset}
                onChange={(e) => setCharset(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="UTF-8">UTF-8 (推荐通用国际标准)</option>
                <option value="GBK">GBK (金融遗留系统)</option>
                <option value="GB2312">GB2312 (简化中文)</option>
                <option value="ISO-8859-1">ISO-8859-1 (单字节二进制流)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                报文截断深度 (KB)
              </label>
              <input
                type="number"
                value={maxPayloadKb}
                onChange={(e) => setMaxPayloadKb(Number(e.target.value))}
                min={8}
                max={512}
                step={8}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                超过此长度的报文体只分析前缀特征，防止极端大包压垮内存。
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                会话匹配超时阈值 (毫秒)
              </label>
              <input
                type="number"
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(Number(e.target.value))}
                min={500}
                max={60000}
                step={500}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Card 2: 采样与全链路 */}
          <div className="bg-slate-50/70 p-4 rounded border border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Trace 染色与采样策略</span>
            </h4>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                全局流量采样率: <span className="font-mono text-blue-600">{samplingRate}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={samplingRate}
                onChange={(e) => setSamplingRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1% (仅故障)</span>
                <span>50% (均衡)</span>
                <span>100% (全量追踪)</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-medium text-slate-700 mb-1">
                全链路分布式跟踪 Header 标识
              </label>
              <input
                type="text"
                value={traceHeaderKey}
                onChange={(e) => setTraceHeaderKey(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none font-mono text-[11px]"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                多个用逗号分隔，如 SkyWalking、OpenTelemetry、Zipkin 标头。
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                <input
                  type="checkbox"
                  checked={autoMaskSensitive}
                  onChange={(e) => setAutoMaskSensitive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>联动脱敏模块对身份证、手机号、银行卡号自动屏蔽</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              setCharset('UTF-8');
              setMaxPayloadKb(64);
              setTimeoutMs(3000);
              setSamplingRate(100);
            }}
            className="flex items-center gap-1 px-3 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置为推荐默认值</span>
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存全局模型配置</span>
          </button>
        </div>
      </form>
    </div>
  );
};
