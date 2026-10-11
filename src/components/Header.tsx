import React, { useState } from 'react';
import {
  Search,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  LogOut,
  Bell,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  primaryCollapsed: boolean;
  onTogglePrimaryCollapse: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  primaryCollapsed,
  onTogglePrimaryCollapse,
  onOpenSearch,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-12 bg-[#121620] text-white flex items-center justify-between px-3 border-b border-[#232a3b] select-none shrink-0 z-30">
      {/* Brand & Left Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 font-bold tracking-wider text-base text-white hover:text-blue-400 transition-colors cursor-pointer pl-1">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
            N
          </div>
          <span className="font-sans font-extrabold text-sm tracking-widest text-slate-100">
            NGPM
          </span>
        </div>

        <button
          onClick={onTogglePrimaryCollapse}
          title={primaryCollapsed ? '展开主菜单' : '收起主菜单'}
          className="ml-2 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {primaryCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="全局检索 (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-slate-400 text-xs">搜索配置</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
          title={isFullscreen ? '退出全屏' : '全屏展示'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* User Account / Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-[10px]">
              行
            </div>
            <span className="font-medium text-xs">admin</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 bg-[#1a2233] border border-slate-700/80 rounded-md shadow-xl py-1.5 text-xs text-slate-200 z-50">
                <div className="px-3 py-2 border-b border-slate-700/60">
                  <div className="font-semibold text-white">系统管理员 (admin)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    角色: 超级运维行政员
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-slate-300 hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer transition-colors">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>个人中心与偏好</span>
                  </div>
                  <div className="px-3 py-1.5 text-slate-300 hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer transition-colors">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>权限与操作审计</span>
                  </div>
                  <div className="px-3 py-1.5 text-slate-300 hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer transition-colors">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>告警通知设定</span>
                  </div>
                </div>

                <div className="border-t border-slate-700/60 pt-1">
                  <div
                    onClick={() => setUserMenuOpen(false)}
                    className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>安全退出</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
