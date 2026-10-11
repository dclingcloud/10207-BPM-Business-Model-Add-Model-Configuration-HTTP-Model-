import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { HttpModel, FunctionCodeItem } from '../types/model';

interface FunctionCodeModalProps {
  model: HttpModel | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateModelFunctions: (modelId: number, functions: FunctionCodeItem[]) => void;
}

export const FunctionCodeModal: React.FC<FunctionCodeModalProps> = ({
  model,
  isOpen,
  onClose,
  onUpdateModelFunctions,
}) => {
  // 顶部「添加功能」输入状态
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');

  // 列表行内就地编辑状态 (点击列表编辑按钮后在当前列中修改)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [inlineError, setInlineError] = useState('');

  // 提示信息
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 分页状态 (参照图1: 共 X 条, 下拉选择每页条数, 页码翻页, 跳至 X 页)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('1');

  // 弹窗打开或模型切换时重置
  useEffect(() => {
    if (isOpen) {
      setNewCode('');
      setNewName('');
      setAddError('');
      setEditingIndex(null);
      setInlineError('');
      setCurrentPage(1);
    }
  }, [isOpen, model?.id]);

  if (!isOpen || !model) return null;

  const currentFunctions: FunctionCodeItem[] = model.associatedFunctionCodes || [];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // 生成当前时间格式 YYYY-MM-DD HH:mm:ss
  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  // 1. 添加功能 (顶部区域)
  const handleAddFunction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAddError('');

    const trimmedCode = newCode.trim();
    const trimmedName = newName.trim();

    if (!trimmedCode) {
      setAddError('请输入功能号');
      return;
    }
    if (!trimmedName) {
      setAddError('请输入功能号名称');
      return;
    }

    if (currentFunctions.some((f) => f.code.toLowerCase() === trimmedCode.toLowerCase())) {
      setAddError(`功能号【${trimmedCode}】已存在，不能重复添加`);
      return;
    }

    const nextId =
      currentFunctions.length > 0
        ? Math.max(...currentFunctions.map((f, i) => (typeof f.id === 'number' ? f.id : i + 1))) + 1
        : 1;

    const newItem: FunctionCodeItem = {
      id: nextId,
      code: trimmedCode,
      name: trimmedName,
      createdAt: getCurrentDateTime(),
    };

    const updated = [...currentFunctions, newItem];
    onUpdateModelFunctions(model.id, updated);
    showToast(`新增功能号【${trimmedCode}】成功`);

    setNewCode('');
    setNewName('');
    setAddError('');
  };

  // 2. 开始在当前列中编辑
  const handleStartInlineEdit = (item: FunctionCodeItem, index: number) => {
    setEditingIndex(index);
    setEditCode(item.code || '');
    setEditName(item.name || '');
    setInlineError('');
  };

  // 3. 取消当前列编辑
  const handleCancelInlineEdit = () => {
    setEditingIndex(null);
    setInlineError('');
  };

  // 4. 保存当前列编辑
  const handleSaveInlineEdit = (index: number) => {
    setInlineError('');
    const trimmedCode = editCode.trim();
    const trimmedName = editName.trim();

    if (!trimmedCode) {
      setInlineError('请输入功能号');
      return;
    }
    if (!trimmedName) {
      setInlineError('请输入功能号名称');
      return;
    }

    const duplicate = currentFunctions.some(
      (f, idx) => idx !== index && f.code.toLowerCase() === trimmedCode.toLowerCase()
    );
    if (duplicate) {
      setInlineError(`功能号【${trimmedCode}】已存在，不能重复`);
      return;
    }

    const existingItem = currentFunctions[index];
    const updatedItem: FunctionCodeItem = {
      ...existingItem,
      code: trimmedCode,
      name: trimmedName,
    };

    const updated = [...currentFunctions];
    updated[index] = updatedItem;

    onUpdateModelFunctions(model.id, updated);
    showToast(`功能号【${trimmedCode}】修改已成功保存`);
    setEditingIndex(null);
  };

  // 5. 删除功能号
  const handleDelete = (index: number) => {
    const item = currentFunctions[index];
    if (window.confirm(`确认删除功能号【${item.code} - ${item.name}】？`)) {
      if (editingIndex === index) {
        setEditingIndex(null);
      }
      const updated = currentFunctions.filter((_, i) => i !== index);
      onUpdateModelFunctions(model.id, updated);
      showToast(`功能号【${item.code}】已删除`);
    }
  };

  // 分页数据计算
  const totalItems = currentFunctions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedItems = currentFunctions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 select-none">
      <div className="bg-white rounded shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* 弹窗顶部标题 */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-sm font-semibold text-slate-800">
            功能号关联
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 提示消息 */}
        {toastMsg && (
          <div className="mx-6 mt-3 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 弹窗主体内容 */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* =========================================================================
             顶部区域：添加功能 (严格按照图1样式与字段，无任何自定义添加项)
             ========================================================================= */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded p-4">
            <div className="text-xs font-semibold text-slate-800 mb-3">
              添加功能
            </div>

            {addError && (
              <div className="mb-2 text-xs text-red-500">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddFunction} className="flex items-center gap-4 flex-wrap">
              {/* 功能号 */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-700 whitespace-nowrap">
                  功能号:
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => {
                    setNewCode(e.target.value);
                    if (addError) setAddError('');
                  }}
                  className="w-48 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 功能号名称 */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-700 whitespace-nowrap">
                  功能号名称:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (addError) setAddError('');
                  }}
                  className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 添加按钮 */}
              <button
                type="submit"
                className="px-4 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-normal transition-colors cursor-pointer"
              >
                添加
              </button>
            </form>
          </div>

          {/* =========================================================================
             列表表格区域：完全依照图1列排布 (ID, 功能号, 功能号名称, 创建时间, 操作)
             点击编辑后在当前列直接进行修改
             ========================================================================= */}
          <div className="border border-slate-200 rounded overflow-hidden bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-normal">
                  <th className="px-4 py-2 w-16 text-center font-normal">ID</th>
                  <th className="px-4 py-2 w-48 font-normal">功能号</th>
                  <th className="px-4 py-2 font-normal">功能号名称</th>
                  <th className="px-4 py-2 w-48 font-normal">创建时间</th>
                  <th className="px-4 py-2 text-center w-28 font-normal">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, localIdx) => {
                    const actualIdx = (currentPage - 1) * pageSize + localIdx;
                    const isEditing = editingIndex === actualIdx;
                    const displayId = actualIdx + 1;

                    return (
                      <tr
                        key={item.id || item.code || actualIdx}
                        className={`transition-colors ${
                          isEditing ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* ID 列 */}
                        <td className="px-4 py-2 text-center text-slate-600 align-middle">
                          {item.id || displayId}
                        </td>

                        {/* 功能号 列：编辑时在当前列变为输入框 */}
                        <td className="px-4 py-2 align-middle">
                          {isEditing ? (
                            <div>
                              <input
                                type="text"
                                value={editCode}
                                onChange={(e) => {
                                  setEditCode(e.target.value);
                                  if (inlineError) setInlineError('');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlineEdit(actualIdx);
                                  if (e.key === 'Escape') handleCancelInlineEdit();
                                }}
                                className="w-full px-2 py-1 bg-white border border-blue-400 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                              {inlineError && (
                                <div className="text-[10px] text-red-500 mt-0.5">
                                  {inlineError}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-800">
                              {item.code}
                            </span>
                          )}
                        </td>

                        {/* 功能号名称 列：编辑时在当前列变为输入框 */}
                        <td className="px-4 py-2 align-middle">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => {
                                setEditName(e.target.value);
                                if (inlineError) setInlineError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineEdit(actualIdx);
                                if (e.key === 'Escape') handleCancelInlineEdit();
                              }}
                              className="w-full px-2 py-1 bg-white border border-blue-400 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-slate-800">
                              {item.name}
                            </span>
                          )}
                        </td>

                        {/* 创建时间 列 */}
                        <td className="px-4 py-2 text-slate-500 whitespace-nowrap align-middle">
                          {item.createdAt || model.createdAt || '2025-05-30 14:10:15'}
                        </td>

                        {/* 操作 列：编辑时展示「保存」「取消」，平时展示「编辑」「删除」 */}
                        <td className="px-4 py-2 text-center whitespace-nowrap align-middle">
                          {isEditing ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveInlineEdit(actualIdx)}
                                className="text-[#1677ff] hover:text-blue-700 text-xs cursor-pointer"
                              >
                                保存
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={handleCancelInlineEdit}
                                className="text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartInlineEdit(item, actualIdx)}
                                className="text-[#1677ff] hover:text-blue-700 text-xs cursor-pointer"
                              >
                                编辑
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => handleDelete(actualIdx)}
                                className="text-[#1677ff] hover:text-red-600 text-xs cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================================================
             底部分页栏：参照图1排布 (共 X 条, 下拉每页条数, < 1 >, 跳至 X 页)
             ========================================================================= */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none">
            <div>
              <span>共 </span>
              <span className="font-semibold text-slate-800">{totalItems}</span>
              <span> 条</span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-slate-300 rounded bg-white text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value={10}>10 条/页</option>
                <option value={20}>20 条/页</option>
                <option value={50}>50 条/页</option>
                <option value={100}>100 条/页</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      currentPage === num
                        ? 'bg-[#1677ff] text-white font-medium'
                        : 'border border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer"
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
                  className="w-12 px-1.5 py-0.5 border border-slate-300 rounded text-center text-xs focus:outline-none focus:border-blue-500"
                />
                <span>页</span>
              </div>
            </div>
          </div>

        </div>

        {/* 弹窗底部 */}
        <div className="px-6 py-2.5 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
};
