import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  FolderTree,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { MenuItemId } from '../types/model';

interface SecondarySidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeMenuItem: MenuItemId;
  onSelectMenuItem: (id: MenuItemId) => void;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activeMenuItem,
  onSelectMenuItem,
}) => {
  const [managementOpen, setManagementOpen] = useState(true);
  const [modelConfigOpen, setModelConfigOpen] = useState(true);

  if (collapsed) {
    return (
      <div className="w-10 bg-white border-r border-slate-200 flex flex-col items-center py-3 select-none shrink-0 transition-all">
        <button
          onClick={onToggleCollapse}
          title="展开功能配置"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <PanelLeftOpen className="w-4 h-4 text-slate-600" />
        </button>
        <div className="mt-4 writing-vertical-lr text-xs text-slate-500 font-medium tracking-wider">
          功能配置
        </div>
      </div>
    );
  }

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col select-none shrink-0 transition-all duration-200">
      {/* Title bar */}
      <div className="h-10 px-4 border-b border-slate-100 flex items-center justify-between">
        <span className="font-semibold text-xs text-slate-800 tracking-wide">
          功能配置
        </span>
        <button
          onClick={onToggleCollapse}
          title="收起功能配置"
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-2 px-1 text-xs text-slate-700 space-y-1">
        {/* Group 1: 管理 */}
        <div>
          <button
            onClick={() => setManagementOpen(!managementOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-xs font-medium"
          >
            <span>管理</span>
            {managementOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {managementOpen && (
            <div className="mt-0.5 space-y-0.5 pl-2">
              <button
                onClick={() => onSelectMenuItem('desensitization')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'desensitization'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                脱敏配置
              </button>

              <button
                onClick={() => onSelectMenuItem('smartBaseline')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'smartBaseline'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                智能基线
              </button>

              <button
                onClick={() => onSelectMenuItem('nodeStatistics')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'nodeStatistics'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                节点统计
              </button>
            </div>
          )}
        </div>

        {/* Group 2: 模型配置 */}
        <div className="pt-1">
          <button
            onClick={() => setModelConfigOpen(!modelConfigOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors text-xs font-medium"
          >
            <span>模型配置</span>
            {modelConfigOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {modelConfigOpen && (
            <div className="mt-0.5 space-y-0.5 pl-2">
              <button
                onClick={() => onSelectMenuItem('httpModel')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  activeMenuItem === 'httpModel'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>HTTP模型</span>
                <span className="text-[10px] text-blue-500 font-mono bg-blue-50 px-1 rounded border border-blue-200/50">
                  7
                </span>
              </button>

              <button
                onClick={() => onSelectMenuItem('dubbo')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'dubbo'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                DUBBO
              </button>

              <button
                onClick={() => onSelectMenuItem('appStringPattern')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'appStringPattern'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                App String Pattern
              </button>

              <button
                onClick={() => onSelectMenuItem('unionPay')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'unionPay'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                银联
              </button>

              <button
                onClick={() => onSelectMenuItem('unionPayAtm')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'unionPayAtm'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                UnionPay ATM
              </button>

              <button
                onClick={() => onSelectMenuItem('secondGenPay')}
                className={`w-full text-left px-4 py-1.5 rounded text-xs transition-colors ${
                  activeMenuItem === 'secondGenPay'
                    ? 'bg-[#e6f4ff] text-[#1677ff] font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                二代支付
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
