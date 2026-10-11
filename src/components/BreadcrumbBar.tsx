import React from 'react';
import {
  SlidersHorizontal,
  Search,
  RotateCw,
  ChevronRight
} from 'lucide-react';
import { MenuItemId } from '../types/model';

interface BreadcrumbBarProps {
  activeMenuItem: MenuItemId;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const MENU_LABELS: Record<MenuItemId, { group: string; name: string }> = {
  desensitization: { group: '管理', name: '脱敏配置' },
  smartBaseline: { group: '管理', name: '智能基线' },
  nodeStatistics: { group: '管理', name: '节点统计' },
  httpModel: { group: '模型配置', name: 'HTTP模型' },
  dubbo: { group: '模型配置', name: 'DUBBO' },
  appStringPattern: { group: '模型配置', name: 'App String Pattern' },
  unionPay: { group: '模型配置', name: '银联' },
  unionPayAtm: { group: '模型配置', name: 'UnionPay ATM' },
  secondGenPay: { group: '模型配置', name: '二代支付' },
};

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  activeMenuItem,
  onRefresh,
  isRefreshing,
}) => {
  const current = MENU_LABELS[activeMenuItem] || { group: '模型配置', name: 'HTTP模型' };

  return (
    <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumb Left */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600">
        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 mr-0.5" />
        <span className="hover:text-blue-600 cursor-pointer transition-colors">配置</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-500">{current.group}</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">{current.name}</span>
      </div>

      {/* Right Search & Refresh Actions (去掉时间按钮) */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          onClick={onRefresh}
          title="执行过滤查询"
          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-sm focus:outline-none"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          title="刷新数据"
          className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded transition-colors focus:outline-none"
        >
          <RotateCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin text-blue-600' : '')} />
        </button>
      </div>
    </div>
  );
};
