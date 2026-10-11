import React, { useState } from 'react';
import { Search, X, ChevronRight, Sliders, Layers } from 'lucide-react';
import { MenuItemId, HttpModel } from '../types/model';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: (item: MenuItemId) => void;
  models: HttpModel[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMenu,
  models,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickNavItems: Array<{ id: MenuItemId; title: string; category: string; description: string }> = [
    { id: 'httpModel', title: 'HTTP模型 (模型定义)', category: '模型配置', description: 'HTTP/HTTPS 接口特征路径与出入参解析' },
    { id: 'secondGenPay', title: '二代支付 (CNAPS2)', category: '模型配置', description: '人行二代大额/小额支付清算报文' },
    { id: 'dubbo', title: 'DUBBO RPC 服务模型', category: '模型配置', description: 'RPC 服务接口与方法级性能耗时提取' },
    { id: 'appStringPattern', title: 'App String Pattern 模式', category: '模型配置', description: '自定义字符串特征提取模型' },
    { id: 'unionPay', title: '银联协议模型 (ISO 8583)', category: '模型配置', description: '8583 域解析与商户交易监控' },
    { id: 'unionPayAtm', title: 'UnionPay ATM 渠道模型', category: '模型配置', description: '自助机具存取款与长款冲正' },
    { id: 'desensitization', title: '脱敏配置', category: '管理', description: '卡号、身份证号、敏感字段屏蔽规则' },
    { id: 'smartBaseline', title: '智能基线配置', category: '管理', description: '动态上下限阈值与业务季节性波动学习' },
    { id: 'nodeStatistics', title: '节点统计', category: '管理', description: '网络探针节点与网卡吞吐负载' },
  ];

  const matchedMenus = quickNavItems.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchedModels = models.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.pathRule.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索功能模块、模型名称或路径规则..."
            className="flex-1 text-xs border-none focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 text-xs space-y-3">
          {/* Matched Menus */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
              系统功能导航
            </div>
            <div className="space-y-0.5">
              {matchedMenus.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectMenu(item.id);
                    onClose();
                  }}
                  className="px-2.5 py-2 rounded hover:bg-blue-50 cursor-pointer flex items-center justify-between text-slate-700 transition-colors"
                >
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-slate-400">· {item.category}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Matched Models */}
          {matchedModels.length > 0 && (
            <div className="border-t border-slate-100 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                匹配的 HTTP 协议模型
              </div>
              <div className="space-y-0.5">
                {matchedModels.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMenu('httpModel');
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded hover:bg-blue-50 cursor-pointer flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <div className="font-medium text-blue-600">
                        {m.name} <span className="font-mono text-slate-400 text-[11px]">(ID: {m.id})</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{m.pathRule}</div>
                    </div>
                    <span className="text-[11px] text-slate-400">{m.method}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
