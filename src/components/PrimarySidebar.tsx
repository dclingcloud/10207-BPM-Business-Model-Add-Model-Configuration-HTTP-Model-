import React from 'react';
import {
  FileText,
  Network,
  Database,
  Users,
  GitGraph,
  Bell,
  LayoutDashboard,
  Sliders,
  Share2,
  Bot
} from 'lucide-react';

interface PrimarySidebarProps {
  collapsed: boolean;
  activeId: string;
  onSelect: (id: string) => void;
}

export const PrimarySidebar: React.FC<PrimarySidebarProps> = ({
  collapsed,
  activeId,
  onSelect,
}) => {
  const menuItems = [
    { id: 'packet', icon: FileText, label: '抓包配置' },
    { id: 'localNetwork', icon: Network, label: '本地网络配置' },
    { id: 'data', icon: Database, label: '数据' },
    { id: 'users', icon: Users, label: '用户' },
    { id: 'topology', icon: GitGraph, label: '网络拓扑' },
    { id: 'alerts', icon: Bell, label: '告警中心' },
    { id: 'dashboard', icon: LayoutDashboard, label: '监控大屏' },
    { id: 'config', icon: Sliders, label: '配置' },
    { id: 'thirdParty', icon: Share2, label: '第三方接口配置' },
    { id: 'agent', icon: Bot, label: '智能体' },
  ];

  return (
    <aside
      className={`bg-[#181e2b] text-slate-300 border-r border-[#262f42] flex flex-col transition-all duration-200 select-none shrink-0 z-20 ${
        collapsed ? 'w-13' : 'w-44'
      }`}
    >
      <div className="flex-1 py-2 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId || item.id === 'config';

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center px-3 py-2.5 text-xs transition-colors group relative ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#20283a]'
              }`}
            >
              <div className="flex items-center justify-center shrink-0 w-6">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
              </div>

              {!collapsed && (
                <span className="ml-2.5 truncate text-[13px] tracking-wide">
                  {item.label}
                </span>
              )}

              {/* Active left bar indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-300" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
