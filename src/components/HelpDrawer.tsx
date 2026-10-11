import React from 'react';
import { X, HelpCircle, Code2, BookOpen, CheckCircle, Info } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-sm">HTTP 模型配置与语法指南</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-slate-800 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-blue-800">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>HTTP 协议模型简介</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-600">
              HTTP 模型用于在网络流量镜像探针（NPB/TAP）捕获的 HTTP/HTTPS 通信报文中，通过 URL 路径正则、请求方法、请求体与返回体参数提取规则，对交易流量进行结构化解析并计算响应时延、成功率与错误码。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>1. 路径匹配规则 (正则表达式)</span>
            </h4>
            <p className="text-slate-600 leading-relaxed mb-2 text-[11px]">
              支持标准 PCRE 正则表达式匹配请求 URI 或绝对路径。
            </p>
            <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[11px] space-y-1">
              <div><span className="text-emerald-400">.*</span> <span className="text-slate-500"># 匹配任意路径 (全局兜底)</span></div>
              <div><span className="text-emerald-400">.*\.action$\|\.do$</span> <span className="text-slate-500"># 匹配 Struts 后缀</span></div>
              <div><span className="text-emerald-400">^/api/v[0-9]+/pay/.*</span> <span className="text-slate-500"># 匹配支付 REST 路径</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>2. 报文参数提取语法 (Key-Delimiter Rule)</span>
            </h4>
            <p className="text-slate-600 leading-relaxed mb-2 text-[11px]">
              请求体与返回体参数采用以下分隔符规则进行高性能流式截取：
            </p>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded font-mono text-[11px] text-slate-800 space-y-1">
              <div className="text-blue-700 font-semibold">
                键:&lt;参数名&gt;; 连接符:&lt;分界符&gt;; 终止符:&lt;结束符&gt;; 值:&lt;默认值&gt;;
              </div>
              <div className="pt-1 text-[11px] text-slate-600">
                • <strong>JSON 格式示例:</strong><br />
                <code className="text-emerald-700">键:\"channel; 连接符:\":\"; 终止符:\"\"; 值:;</code>
              </div>
              <div className="pt-1 text-[11px] text-slate-600">
                • <strong>XML / 报文示例:</strong><br />
                <code className="text-emerald-700">键:&lt;Trxld&gt;; 连接符::; 终止符:&lt;/; 值:;</code>
              </div>
              <div className="pt-1 text-[11px] text-slate-600">
                • <strong>普通键值对示例:</strong><br />
                <code className="text-emerald-700">键:errorCode; 连接符:\":\"; 终止符:\"; 值:;</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. 功能号关联说明</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              点击每行列表右侧的「功能号关联」按钮，可为该模型挂载多个交易代码（如 NUCC_2001、核心账务扣款），并设置该功能号对应的独立 SLA 阈值与重大故障标记。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium"
          >
            我已知晓
          </button>
        </div>
      </div>
    </div>
  );
};
