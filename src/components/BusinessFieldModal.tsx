import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

export interface BusinessFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomNames?: (names: Record<string, string>) => void;
  customNames?: Record<string, string>;
  // For backwards compatibility
  fields?: any[];
  onSaveField?: (field: any) => void;
  onDeleteField?: (id: string) => void;
}

// 左右两栏字段列表安排 (共40个默认业务字段，两列各20项)
// 左侧以「功能号」起始，右侧以「普通号」起始，完全复现图示两栏网格结构
export const LEFT_DEFAULT_FIELDS = [
  '功能号',
  '追踪号',
  '渠道号',
  '子渠道号',
  '子功能号',
  '统计号1',
  '统计号2',
  '统计号3',
  '返回码',
  '字符串1',
  '字符串2',
  '字符串3',
  '字符串4',
  '字符串5',
  '字符串6',
  '字符串7',
  '字符串8',
  '整型1',
  '整型2',
  '整型3',
] as const;

export const RIGHT_DEFAULT_FIELDS = [
  '普通号',
  '字符串9',
  '字符串10',
  '字符串11',
  '字符串12',
  '字符串13',
  '字符串14',
  '字符串15',
  '整型4',
  '整型5',
  '整型6',
  '整型7',
  '整型8',
  '整型9',
  '整型10',
  '浮点数1',
  '浮点数2',
  '浮点数3',
  '浮点数4',
  '浮点数5',
] as const;

const LOCAL_STORAGE_KEY = 'ngpm_business_field_custom_names';

const INITIAL_DEFAULT_MAPPING: Record<string, string> = {
  功能号: '交易代码',
  普通号: '',
  追踪号: '全局流水号',
  渠道号: '接入渠道',
  子渠道号: '',
  子功能号: '',
  统计号1: '',
  统计号2: '',
  统计号3: '',
  返回码: '响应应答码',
};

export const BusinessFieldModal: React.FC<BusinessFieldModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomNames,
  customNames,
}) => {
  const [fieldMap, setFieldMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_DEFAULT_MAPPING, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INITIAL_DEFAULT_MAPPING;
  });

  useEffect(() => {
    if (customNames && Object.keys(customNames).length > 0) {
      setFieldMap((prev) => ({ ...prev, ...customNames }));
    }
  }, [customNames]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFieldMap((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    const emptyMap: Record<string, string> = {};
    [...LEFT_DEFAULT_FIELDS, ...RIGHT_DEFAULT_FIELDS].forEach((f) => {
      emptyMap[f] = '';
    });
    setFieldMap(emptyMap);
  };

  const handleConfirm = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fieldMap));
    } catch {
      // ignore
    }
    if (onSaveCustomNames) {
      onSaveCustomNames(fieldMap);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs select-none">
      {/* 弹窗容器 (浅色系主题：白底、圆角阴影、顶部标题及✕按钮) */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* 标题栏 (浅色系，纯白底与灰色分割线) */}
        <div className="px-6 py-3.5 flex items-center justify-between border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 tracking-wide">
              业务字段
            </h3>
            <span className="text-xs text-slate-400">
              (配置系统默认字段的自定义展示名称)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 弹窗主体内容：两列对称表格，浅色系 */}
        <div className="p-5 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 左侧表格 */}
            <div className="border border-slate-200 rounded overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <th className="px-3.5 py-2 w-32 border-r border-slate-200 bg-[#f1f5f9]/70 text-center">
                      默认字段
                    </th>
                    <th className="px-3.5 py-2 bg-[#f8fafc]">
                      自定义名称
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {LEFT_DEFAULT_FIELDS.map((fieldName) => (
                    <tr
                      key={fieldName}
                      className="hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-3 py-1.5 text-center font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50 whitespace-nowrap">
                        {fieldName}
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={fieldMap[fieldName] || ''}
                          onChange={(e) =>
                            handleInputChange(fieldName, e.target.value)
                          }
                          placeholder="请输入自定义名称"
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none bg-white hover:border-slate-300 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 右侧表格 */}
            <div className="border border-slate-200 rounded overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] text-slate-700 border-b border-slate-200 font-semibold select-none">
                    <th className="px-3.5 py-2 w-32 border-r border-slate-200 bg-[#f1f5f9]/70 text-center">
                      默认字段
                    </th>
                    <th className="px-3.5 py-2 bg-[#f8fafc]">
                      自定义名称
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {RIGHT_DEFAULT_FIELDS.map((fieldName) => (
                    <tr
                      key={fieldName}
                      className="hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-3 py-1.5 text-center font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50 whitespace-nowrap">
                        {fieldName}
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={fieldMap[fieldName] || ''}
                          onChange={(e) =>
                            handleInputChange(fieldName, e.target.value)
                          }
                          placeholder="请输入自定义名称"
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none bg-white hover:border-slate-300 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 底部按钮栏 (包含重置、取消与确认按钮，纯浅色系风格) */}
        <div className="px-6 py-3 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>重置</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>确认</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
