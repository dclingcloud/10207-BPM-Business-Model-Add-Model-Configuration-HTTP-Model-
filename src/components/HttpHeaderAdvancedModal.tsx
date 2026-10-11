import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { NUMBER_MODE_OPTIONS } from '../types/model';

export interface SubstringExtractionRule {
  id: string;
  startType: string;
  startVal: string;
  connector: string;
  endType: string;
  endVal: string;
  numberType: string;
  fieldName: string;
  encoding: string;
}

interface HttpHeaderAdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerKey?: string;
  onSave: (rules: SubstringExtractionRule[]) => void;
  initialRules?: SubstringExtractionRule[];
}

export const HttpHeaderAdvancedModal: React.FC<HttpHeaderAdvancedModalProps> = ({
  isOpen,
  onClose,
  headerKey = '',
  onSave,
  initialRules,
}) => {
  const [rules, setRules] = useState<SubstringExtractionRule[]>(
    initialRules && initialRules.length > 0
      ? initialRules
      : [
          {
            id: 'sub_1',
            startType: '起始符',
            startVal: '',
            connector: '',
            endType: '终止符',
            endVal: '',
            numberType: '普通号',
            fieldName: '',
            encoding: 'UTF8',
          },
        ]
  );

  if (!isOpen) return null;

  const handleClearRule = (index: number) => {
    const next = [...rules];
    next[index] = {
      ...next[index],
      startVal: '',
      connector: '',
      endVal: '',
      fieldName: '',
    };
    setRules(next);
  };

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: `sub_${Date.now()}`,
        startType: '起始符',
        startVal: '',
        connector: '',
        endType: '终止符',
        endVal: '',
        numberType: '普通号',
        fieldName: '',
        encoding: 'UTF8',
      },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    if (rules.length <= 1) {
      handleClearRule(0);
      return;
    }
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onSave(rules);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      {/* 弹窗容器 (参考图7浅色系样式：白底、圆角阴影、顶部标题及✕按钮) */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* 标题栏 (图6标题：HTTP 头部字段 / 高级配置) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              HTTP 头部字段 / 高级配置
            </h3>
            {headerKey && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-mono">
                {headerKey}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 弹窗主体内容 (图6字段布局) */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* 子串提取分类标题 */}
          <div className="text-xs font-semibold text-slate-800">
            子串提取
          </div>

          {/* 规则项列表 */}
          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="p-4 bg-[#f8fafc] border border-slate-200/90 rounded-md text-xs space-y-3"
              >
                {/* 第一行 (图6): 起始符/偏移量 [input], 连接符 [input], 终止符/长度 [input], 普通号下拉 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 起始符 / 偏移量 */}
                  <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <select
                      value={rule.startType}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].startType = e.target.value;
                        setRules(next);
                      }}
                      className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0"
                    >
                      <option value="起始符">起始符</option>
                      <option value="偏移量">偏移量</option>
                    </select>
                    <input
                      type="text"
                      value={rule.startVal}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].startVal = e.target.value;
                        setRules(next);
                      }}
                      placeholder="值"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white"
                    />
                  </div>

                  {/* 连接符 */}
                  <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                      连接符
                    </span>
                    <input
                      type="text"
                      value={rule.connector}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].connector = e.target.value;
                        setRules(next);
                      }}
                      placeholder="如 :"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white font-mono"
                    />
                  </div>

                  {/* 终止符 / 长度 */}
                  <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <select
                      value={rule.endType}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].endType = e.target.value;
                        setRules(next);
                      }}
                      className="bg-slate-50 text-slate-700 px-2 py-1.5 border-r border-slate-300 text-xs focus:outline-none cursor-pointer shrink-0"
                    >
                      <option value="终止符">终止符</option>
                      <option value="长度">长度</option>
                    </select>
                    <input
                      type="text"
                      value={rule.endVal}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].endVal = e.target.value;
                        setRules(next);
                      }}
                      placeholder="值"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white"
                    />
                  </div>

                  {/* 普通号 / 功能号 下拉 */}
                  <div>
                    <select
                      value={rule.numberType}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].numberType = e.target.value;
                        setRules(next);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {NUMBER_MODE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 第二行 (图6): 字段名称 [input], 编码格式 [UTF8 v], 右侧 清空 / 删除 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* 字段名称 */}
                    <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-56">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        字段名称
                      </span>
                      <input
                        type="text"
                        value={rule.fieldName}
                        onChange={(e) => {
                          const next = [...rules];
                          next[idx].fieldName = e.target.value;
                          setRules(next);
                        }}
                        placeholder="请输入字段名"
                        className="w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none bg-white"
                      />
                    </div>

                    {/* 编码格式 */}
                    <div className="flex rounded border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-48">
                      <span className="bg-slate-50 text-slate-700 px-2.5 py-1.5 border-r border-slate-300 text-xs shrink-0 font-medium">
                        编码格式
                      </span>
                      <select
                        value={rule.encoding}
                        onChange={(e) => {
                          const next = [...rules];
                          next[idx].encoding = e.target.value;
                          setRules(next);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white text-slate-700 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="UTF8">UTF8</option>
                        <option value="GBK">GBK</option>
                        <option value="URL Encode">URL Encode</option>
                      </select>
                    </div>
                  </div>

                  {/* 清空与删除按钮 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleClearRule(idx)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded text-xs transition-colors"
                    >
                      清空
                    </button>
                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="删除该条子串提取"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* + 添加按钮 (图6: 虚线边框) */}
          <button
            type="button"
            onClick={handleAddRule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 border-dashed rounded text-xs font-medium transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加</span>
          </button>
        </div>

        {/* 弹窗底部操作条 (参考图6与图7: 右侧 取消 / 保存) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
