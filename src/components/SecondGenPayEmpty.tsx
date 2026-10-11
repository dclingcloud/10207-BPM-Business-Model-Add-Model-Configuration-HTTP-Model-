import React from 'react';
import { FolderX, Plus, FileCode2 } from 'lucide-react';

interface SecondGenPayEmptyProps {
  onAddModel: () => void;
  title?: string;
  activeTab: 'manage' | 'config';
  onTabChange: (tab: 'manage' | 'config') => void;
}

export const SecondGenPayEmpty: React.FC<SecondGenPayEmptyProps> = ({
  onAddModel,
  title = '二代支付',
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex-1 bg-white rounded-sm border border-slate-200 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="px-5 pt-4 pb-0 border-b border-slate-200 flex items-center gap-2">
        <button
          onClick={() => onTabChange('manage')}
          className={`px-4 py-2 text-xs font-medium rounded-t-sm border transition-colors ${
            activeTab === 'manage'
              ? 'border-blue-500 border-b-white bg-white text-blue-600 -mb-px'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          模型管理
        </button>
        <button
          onClick={() => onTabChange('config')}
          className={`px-4 py-2 text-xs font-medium rounded-t-sm border transition-colors ${
            activeTab === 'config'
              ? 'border-blue-500 border-b-white bg-white text-blue-600 -mb-px'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          模型配置
        </button>
      </div>

      {/* Empty Content Canvas (Matches Image 2) */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[460px]">
        {/* Soft folder icon */}
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4 border border-slate-200/80 shadow-xs">
          <FolderX className="w-10 h-10 text-slate-400" />
        </div>

        <h3 className="text-slate-600 font-medium text-sm mb-1">
          暂无数据
        </h3>
        <p className="text-slate-400 text-xs mb-6 max-w-sm text-center">
          当前【{title}】协议模型尚未录入定义规则，请点击下方按钮新建模型或导入协议模版。
        </p>

        <button
          onClick={onAddModel}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <Plus className="w-4 h-4" />
          <span>添加模型</span>
        </button>
      </div>
    </div>
  );
};
