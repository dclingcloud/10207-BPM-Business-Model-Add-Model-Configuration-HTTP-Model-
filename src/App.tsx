/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { PrimarySidebar } from './components/PrimarySidebar';
import { SecondarySidebar } from './components/SecondarySidebar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { HttpModelList } from './components/HttpModelList';
import { ModelConfigPage } from './components/ModelConfigPage';
import { SecondGenPayEmpty } from './components/SecondGenPayEmpty';
import { SearchModal } from './components/SearchModal';
import { INITIAL_HTTP_MODELS, INITIAL_BUSINESS_FIELDS } from './data/initialData';
import { HttpModel, BusinessField, MenuItemId, FunctionCodeItem } from './types/model';
import { ShieldCheck, LineChart } from 'lucide-react';

export default function App() {
  // Global layout states
  const [primaryCollapsed, setPrimaryCollapsed] = useState(false);
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(false);
  const [activePrimaryId, setActivePrimaryId] = useState('config');
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItemId>('httpModel');
  const [activeTab, setActiveTab] = useState<'manage' | 'config'>('manage');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [httpModels, setHttpModels] = useState<HttpModel[]>(INITIAL_HTTP_MODELS);
  const [businessFields, setBusinessFields] = useState<BusinessField[]>(INITIAL_BUSINESS_FIELDS);

  // Model Operations
  const handleSaveModelFromConfig = (newOrUpdatedModel: HttpModel) => {
    const existingIndex = httpModels.findIndex((m) => m.id === newOrUpdatedModel.id);
    if (existingIndex >= 0) {
      setHttpModels(
        httpModels.map((m) => (m.id === newOrUpdatedModel.id ? newOrUpdatedModel : m))
      );
    } else {
      // New model added
      const nextId =
        httpModels.length > 0 ? Math.max(...httpModels.map((m) => m.id)) + 1 : 1;
      const modelWithId = {
        ...newOrUpdatedModel,
        id: newOrUpdatedModel.id && newOrUpdatedModel.id < 10000000 ? newOrUpdatedModel.id : nextId,
      };
      setHttpModels([modelWithId, ...httpModels]);
    }

    // Requirement 2: 点击保存后展示至模型管理页面
    setActiveTab('manage');
  };

  const handleUpdateModel = (updatedModel: HttpModel) => {
    setHttpModels(httpModels.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
  };

  const handleDeleteModel = (id: number) => {
    setHttpModels(httpModels.filter((m) => m.id !== id));
  };

  const handleUpdateModelFunctions = (modelId: number, functions: FunctionCodeItem[]) => {
    setHttpModels(
      httpModels.map((m) => (m.id === modelId ? { ...m, associatedFunctionCodes: functions } : m))
    );
  };

  // Reset to initial 7 models or clear
  const handleResetInitialData = () => {
    setHttpModels(INITIAL_HTTP_MODELS);
  };

  const handleClearAllModels = () => {
    setHttpModels([]);
  };

  // Business Field Operations
  const handleSaveBusinessField = (field: BusinessField) => {
    const exists = businessFields.some((f) => f.id === field.id);
    if (exists) {
      setBusinessFields(businessFields.map((f) => (f.id === field.id ? field : f)));
    } else {
      setBusinessFields([...businessFields, field]);
    }
  };

  const handleDeleteBusinessField = (id: string) => {
    setBusinessFields(businessFields.filter((f) => f.id !== id));
  };

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-900">
      {/* 1. Top Bar */}
      <Header
        primaryCollapsed={primaryCollapsed}
        onTogglePrimaryCollapse={() => setPrimaryCollapsed(!primaryCollapsed)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Workspace Row */}
      <div className="flex flex-1 overflow-hidden">
        {/* 2.1 Leftmost Dark Icon Sidebar */}
        <PrimarySidebar
          collapsed={primaryCollapsed}
          activeId={activePrimaryId}
          onSelect={(id) => setActivePrimaryId(id)}
        />

        {/* 2.2 Secondary Light Sidebar (功能配置) */}
        <SecondarySidebar
          collapsed={secondaryCollapsed}
          onToggleCollapse={() => setSecondaryCollapsed(!secondaryCollapsed)}
          activeMenuItem={activeMenuItem}
          onSelectMenuItem={(id) => {
            setActiveMenuItem(id);
            setActiveTab('manage');
          }}
        />

        {/* 2.3 Main Work Canvas */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f0f2f5]">
          {/* Breadcrumb & Datetime filter bar */}
          <BreadcrumbBar
            activeMenuItem={activeMenuItem}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Main Content Area */}
          <div className="flex-1 p-3.5 overflow-y-auto">
            {activeMenuItem === 'httpModel' ? (
              // HTTP 模型页面 (包含模型管理与结合图2、图3的模型配置页面)
              <div className="bg-white rounded-sm border border-slate-200 flex flex-col shadow-2xs min-h-full">
                {/* Tabs (Matching Image 1) */}
                <div className="px-5 pt-3.5 pb-0 border-b border-slate-200 flex items-center gap-2 bg-white shrink-0 select-none">
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-t-sm border transition-colors ${
                      activeTab === 'manage'
                        ? 'border-blue-500 border-b-white bg-white text-blue-600 -mb-px'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    模型管理
                  </button>
                  <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-t-sm border transition-colors ${
                      activeTab === 'config'
                        ? 'border-blue-500 border-b-white bg-white text-blue-600 -mb-px'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    模型配置
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'manage' ? (
                  // Requirement 1 & 3: 模型管理界面
                  <HttpModelList
                    models={httpModels}
                    onNavigateToConfig={() => setActiveTab('config')}
                    onUpdateModel={handleUpdateModel}
                    onDeleteModel={handleDeleteModel}
                    businessFields={businessFields}
                    onSaveBusinessField={handleSaveBusinessField}
                    onDeleteBusinessField={handleDeleteBusinessField}
                    onUpdateModelFunctions={handleUpdateModelFunctions}
                    onResetInitialData={handleResetInitialData}
                    onClearAllModels={handleClearAllModels}
                  />
                ) : (
                  // Requirement 2: 模型配置修改查看图2、图3结合在一起作为模型配置页面，点击保存后展示至模型管理页面
                  <ModelConfigPage
                    onSaveModel={handleSaveModelFromConfig}
                    onCancel={() => setActiveTab('manage')}
                  />
                )}
              </div>
            ) : activeMenuItem === 'secondGenPay' ? (
              // 二代支付 (完全复现图1中的初始空白视图)
              <SecondGenPayEmpty
                title="二代支付"
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddModel={() => {
                  setActiveMenuItem('httpModel');
                  setActiveTab('config');
                }}
              />
            ) : activeMenuItem === 'desensitization' ? (
              // 脱敏配置视图
              <div className="bg-white rounded-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-sm text-slate-900">数据脱敏规则策略</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  系统已预设 14 条银行卡、身份证、手机号、密码敏感信息正则掩码脱敏规则。流量探针在提取 HTTP 报文特征时将自动执行脱敏处理，确保敏感数据不落盘。
                </p>
                <button
                  onClick={() => setActiveMenuItem('httpModel')}
                  className="px-3 py-1.5 bg-[#1677ff] text-white rounded text-xs hover:bg-blue-600"
                >
                  返回 HTTP 模型配置
                </button>
              </div>
            ) : activeMenuItem === 'smartBaseline' ? (
              // 智能基线
              <div className="bg-white rounded-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <LineChart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-sm text-slate-900">智能动态基线学习</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  采用自回归移动平均与季节性分解算法（ARIMA + STL），根据各 HTTP 协议模型的历史每分钟 TPS 与响应耗时计算上下限浮动置信区间。
                </p>
                <button
                  onClick={() => setActiveMenuItem('httpModel')}
                  className="px-3 py-1.5 bg-[#1677ff] text-white rounded text-xs hover:bg-blue-600"
                >
                  返回 HTTP 模型配置
                </button>
              </div>
            ) : (
              // 其他模型协议 (DUBBO, App String Pattern, 银联, UnionPay ATM)
              <SecondGenPayEmpty
                title={
                  activeMenuItem === 'dubbo'
                    ? 'DUBBO'
                    : activeMenuItem === 'appStringPattern'
                    ? 'App String Pattern'
                    : activeMenuItem === 'unionPay'
                    ? '银联'
                    : 'UnionPay ATM'
                }
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddModel={() => {
                  setActiveMenuItem('httpModel');
                  setActiveTab('config');
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMenu={(menuId) => setActiveMenuItem(menuId)}
        models={httpModels}
      />
    </div>
  );
}
