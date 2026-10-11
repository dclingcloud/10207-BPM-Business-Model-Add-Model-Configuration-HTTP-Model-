import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Edit2,
  HelpCircle,
  CheckCircle2,
  FolderX,
  X,
  RotateCcw
} from 'lucide-react';
import { HttpModel, BusinessField, FunctionCodeItem } from '../types/model';
import { BusinessFieldModal } from './BusinessFieldModal';
import { FunctionCodeModal } from './FunctionCodeModal';
import { HelpDrawer } from './HelpDrawer';
import { ModelConfigPage } from './ModelConfigPage';

interface HttpModelListProps {
  models: HttpModel[];
  onNavigateToConfig: () => void;
  onUpdateModel: (model: HttpModel) => void;
  onDeleteModel: (id: number) => void;
  businessFields: BusinessField[];
  onSaveBusinessField: (field: BusinessField) => void;
  onDeleteBusinessField: (id: string) => void;
  onUpdateModelFunctions: (modelId: number, functions: FunctionCodeItem[]) => void;
  onResetInitialData?: () => void;
  onClearAllModels?: () => void;
}

export const HttpModelList: React.FC<HttpModelListProps> = ({
  models,
  onNavigateToConfig,
  onUpdateModel,
  onDeleteModel,
  businessFields,
  onSaveBusinessField,
  onDeleteBusinessField,
  onUpdateModelFunctions,
  onResetInitialData,
  onClearAllModels,
}) => {
  // Modal & Drawer states
  const [selectedModelIdForFunctions, setSelectedModelIdForFunctions] = useState<number | null>(null);
  const activeModelForFunctions = useMemo(() => {
    if (selectedModelIdForFunctions === null) return null;
    return models.find((m) => m.id === selectedModelIdForFunctions) || null;
  }, [models, selectedModelIdForFunctions]);
  const [isBusinessFieldModalOpen, setIsBusinessFieldModalOpen] = useState(false);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);

  // Requirement 3: Inline edit model below table
  const [editingModel, setEditingModel] = useState<HttpModel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [jumpPage, setJumpPage] = useState('1');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Paginated items
  const totalItems = models.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedModels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return models.slice(start, start + pageSize);
  }, [models, currentPage, pageSize]);

  // Empty state: 只保留无数据提示与恢复数据操作
  if (models.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[460px] bg-white select-none">
        {/* Soft folder icon */}
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4 border border-slate-200/80 shadow-xs">
          <FolderX className="w-10 h-10 text-slate-400" />
        </div>

        <h3 className="text-slate-600 font-medium text-sm mb-1">
          暂无数据
        </h3>
        <p className="text-slate-400 text-xs mb-6 max-w-sm text-center">
          当前尚未录入任何模型记录。
        </p>

        {onResetInitialData && (
          <button
            onClick={onResetInitialData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>恢复示例数据</span>
          </button>
        )}
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded shadow-lg text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Header: 使用清空状态按钮 */}
      <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">
            当前协议模型共 <span className="font-mono font-semibold text-blue-600">{models.length}</span> 项
          </span>
        </div>

        {/* Right Buttons: 业务字段 & 清空状态 & Help */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBusinessFieldModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-300 rounded transition-colors"
          >
            <span>业务字段</span>
          </button>

          {onClearAllModels && (
            <button
              onClick={onClearAllModels}
              title="清空当前模型状态"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-300 rounded transition-colors"
            >
              <span>清空状态</span>
            </button>
          )}

          <button
            onClick={() => setIsHelpDrawerOpen(true)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
            title="规则语法与帮助说明"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HTTP模型列表头部 (已去掉搜索模型与方法查询功能) */}
      <div className="px-5 py-2.5 border-b border-slate-200 bg-[#f8fafc] flex items-center justify-between text-xs select-none">
        <span className="font-semibold text-slate-800">
          HTTP模型列表
        </span>
        <span className="text-slate-500 text-[11px]">
          共 <span className="font-mono font-medium text-slate-700">{models.length}</span> 条模型记录
        </span>
      </div>

      {/* Models Table (Requirement 3: 去掉列表中的下拉icon) */}
      <div className="flex-1 overflow-x-auto min-h-[260px]">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold select-none">
              {/* Note: NO dropdown icon column here! Directly start with 模型ID */}
              <th className="px-4 py-2.5 font-semibold">模型ID</th>
              <th className="px-3 py-2.5 font-semibold">名称</th>
              <th className="px-3 py-2.5 font-semibold">方法</th>
              <th className="px-3 py-2.5 font-semibold">路径规则</th>
              <th className="px-3 py-2.5 font-semibold">请求体参数</th>
              <th className="px-3 py-2.5 font-semibold">返回体参数</th>
              <th className="px-3 py-2.5 font-semibold">创建时间</th>
              <th className="px-3 py-2.5 font-semibold text-center">功能号</th>
              <th className="px-4 py-2.5 font-semibold text-center w-32">配置</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedModels.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  未匹配到符合条件的 HTTP 模型定义
                </td>
              </tr>
            ) : (
              paginatedModels.map((m) => {
                const isCurrentEditing = editingModel?.id === m.id;
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isCurrentEditing
                        ? 'bg-blue-50/80 border-l-4 border-l-[#1677ff]'
                        : 'hover:bg-blue-50/40'
                    }`}
                  >
                    {/* 模型ID */}
                    <td className="px-4 py-2.5 font-mono text-slate-700 font-semibold">
                      {m.id}
                    </td>

                    {/* 名称 */}
                    <td className="px-3 py-2.5 text-slate-900 font-medium">
                      {m.name}
                    </td>

                    {/* 方法 */}
                    <td className="px-3 py-2.5 text-slate-600">
                      {m.method}
                    </td>

                    {/* 路径规则 */}
                    <td className="px-3 py-2.5 font-mono text-slate-600 max-w-[140px] truncate" title={m.pathRule}>
                      {m.pathRule}
                    </td>

                    {/* 请求体参数 */}
                    <td
                      className="px-3 py-2.5 font-mono text-slate-500 max-w-[200px] truncate"
                      title={m.requestBodyParam}
                    >
                      {m.requestBodyParam}
                    </td>

                    {/* 返回体参数 */}
                    <td
                      className="px-3 py-2.5 font-mono text-slate-500 max-w-[200px] truncate"
                      title={m.responseBodyParam}
                    >
                      {m.responseBodyParam}
                    </td>

                    {/* 创建时间 */}
                    <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                      {m.createdAt}
                    </td>

                    {/* 功能号按钮 */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => setSelectedModelIdForFunctions(m.id)}
                        className="px-2.5 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-[11px] font-medium transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                      >
                        功能号关联
                      </button>
                    </td>

                    {/* 配置列: 编辑 | 删除 (Requirement 4: 编辑按钮后，在当前配置列进行修改) */}
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (isCurrentEditing) {
                              setEditingModel(null);
                            } else {
                              setEditingModel(m);
                              setTimeout(() => {
                                const el = document.getElementById('inline-model-config');
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 80);
                            }
                          }}
                          className={`text-xs font-medium cursor-pointer transition-colors px-2 py-0.5 rounded ${
                            isCurrentEditing
                              ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                          }`}
                        >
                          {isCurrentEditing ? '收起配置' : '编辑'}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(m.id)}
                          className="text-blue-600 hover:text-red-600 text-xs font-medium cursor-pointer transition-colors px-1 py-0.5"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-5 py-2.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none">
        <div>
          <span>共 </span>
          <span className="font-mono font-semibold text-slate-800">{totalItems}</span>
          <span> 条</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-300 rounded bg-white text-xs text-slate-700 focus:outline-none"
          >
            <option value={10}>10条/页</option>
            <option value={15}>15条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  currentPage === num
                    ? 'bg-[#1677ff] text-white font-semibold'
                    : 'border border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs"
            >
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span>跳至</span>
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = parseInt(jumpPage, 10);
                  if (!isNaN(target) && target >= 1 && target <= totalPages) {
                    setCurrentPage(target);
                  }
                }
              }}
              className="w-12 px-1.5 py-0.5 border border-slate-300 rounded text-center font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* Requirement 4: 编辑按钮后，在当前配置列/视图进行修改 (风格样式与交互严格参考图3) */}
      {editingModel && (
        <div
          id="inline-model-config"
          className="border-t-2 border-blue-500 bg-white p-6 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 rounded">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800 text-sm">
                模型配置修改
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono text-xs font-semibold border border-blue-200">
                当前模型: {editingModel.name} (ID: {editingModel.id})
              </span>
              <span className="text-xs text-slate-500 hidden md:inline">
                已在当前配置列下方载入模型完整参数，编辑后点击「保存」可直接更新上方列表
              </span>
            </div>
            <button
              onClick={() => setEditingModel(null)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>收起配置</span>
            </button>
          </div>

          <ModelConfigPage
            initialModel={editingModel}
            isInline={true}
            onSaveModel={(updated) => {
              onUpdateModel(updated);
              setEditingModel(null);
              showToast(`模型【${updated.name}】配置已成功保存！`);
            }}
            onCancel={() => setEditingModel(null)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 p-5 text-xs space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">确认删除该协议模型？</h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              删除后，探针引擎将停止对该模型路径与参数特征的解析。此操作无法撤销。
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDeleteModel(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('模型已删除');
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Field Modal & Function Code Modal & Help Drawer */}
      <BusinessFieldModal
        isOpen={isBusinessFieldModalOpen}
        onClose={() => setIsBusinessFieldModalOpen(false)}
        onSaveCustomNames={() => {
          showToast('业务字段配置已成功保存');
        }}
        fields={businessFields}
        onSaveField={onSaveBusinessField}
        onDeleteField={onDeleteBusinessField}
      />

      <FunctionCodeModal
        model={activeModelForFunctions}
        isOpen={activeModelForFunctions !== null}
        onClose={() => setSelectedModelIdForFunctions(null)}
        onUpdateModelFunctions={onUpdateModelFunctions}
      />

      <HelpDrawer
        isOpen={isHelpDrawerOpen}
        onClose={() => setIsHelpDrawerOpen(false)}
      />
    </div>
  );
};
