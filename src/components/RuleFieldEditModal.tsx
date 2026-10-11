import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export interface ParamGroup {
  groupName: string;
  params: string[];
}

interface RuleFieldEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKey?: string;
  initialValue?: string;
  paramGroups?: ParamGroup[];
  onConfirm: (key: string, value: string) => void;
}

export const RuleFieldEditModal: React.FC<RuleFieldEditModalProps> = ({
  isOpen,
  onClose,
  initialKey = '',
  initialValue = '',
  paramGroups = [],
  onConfirm,
}) => {
  // 默认分组与参数 (严格包含图示中的「路径参数 -> 111」与「请求体参数 -> 11122」)
  const defaultGroups: ParamGroup[] = [
    {
      groupName: '路径参数',
      params: ['111'],
    },
    {
      groupName: '请求体参数',
      params: ['11122', 'channel', 'TrxId', '功能号'],
    },
    {
      groupName: '返回体参数',
      params: ['RetCode', 'SysRtnCd', 'status'],
    },
    {
      groupName: 'HTTP 头部字段',
      params: ['Authorization', 'X-Forwarded-For'],
    },
  ];

  // 融合传入的分组数据，确保图示中规则规范
  const effectiveGroups: ParamGroup[] =
    paramGroups && paramGroups.length > 0
      ? paramGroups.map((g) => {
          if (g.groupName === '路径参数' && !g.params.includes('111')) {
            return { ...g, params: ['111', ...g.params] };
          }
          if (g.groupName === '请求体参数' && !g.params.includes('11122')) {
            return { ...g, params: ['11122', ...g.params] };
          }
          return g;
        })
      : defaultGroups;

  // 展开所有可用参数扁平数组
  const allAvailableParams = effectiveGroups.flatMap((g) => g.params);

  // 参数选择状态
  const [selectedParam, setSelectedParam] = useState(initialKey || '111');
  const [isParamDropdownOpen, setIsParamDropdownOpen] = useState(false);
  const [isCustomParam, setIsCustomParam] = useState(false);
  const [customParamText, setCustomParamText] = useState('');

  // 任意值状态 (图1中的任意值开关)
  const [isAnyValue, setIsAnyValue] = useState(
    initialValue === '*' || initialValue === '任意值'
  );

  // 值选择状态
  const [selectedValue, setSelectedValue] = useState(
    initialValue && initialValue !== '*' && initialValue !== '任意值'
      ? initialValue
      : ''
  );
  const [isCustomValue, setIsCustomValue] = useState(false);
  const [customValueText, setCustomValueText] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsParamDropdownOpen(false);
      }
    };

    if (isParamDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isParamDropdownOpen]);

  useEffect(() => {
    if (isOpen) {
      const isInitialAny = initialValue === '*' || initialValue === '任意值';
      setIsAnyValue(isInitialAny);

      if (initialKey) {
        if (allAvailableParams.includes(initialKey)) {
          setSelectedParam(initialKey);
          setIsCustomParam(false);
        } else {
          setSelectedParam(initialKey);
          setIsCustomParam(true);
          setCustomParamText(initialKey);
        }
      } else {
        setSelectedParam('111');
        setIsCustomParam(false);
        setCustomParamText('');
      }

      if (!isInitialAny && initialValue) {
        setSelectedValue(initialValue);
        setCustomValueText(initialValue);
      } else {
        setSelectedValue('');
        setCustomValueText('');
      }
      setIsParamDropdownOpen(false);
    }
  }, [isOpen, initialKey, initialValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalKey = isCustomParam ? customParamText.trim() : selectedParam;
    const finalVal = isAnyValue
      ? '*'
      : isCustomValue
      ? customValueText.trim()
      : selectedValue || customValueText.trim() || '';

    onConfirm(finalKey || '111', finalVal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      {/* 弹窗容器 (参考高级配置浅色系弹窗: 白底、圆角阴影、顶部标题及✕按钮) */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-visible border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* 标题栏 (图1: 规则编辑) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-lg">
          <h3 className="font-semibold text-slate-900 text-sm">规则编辑</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 弹窗主体 (图1中逻辑内容) */}
        <div className="p-6 space-y-5 text-xs">
          {/* 行 1: 参数选择 (带图示中分组下拉交互：路径参数 -> 111，请求体参数 -> 11122) */}
          <div className="flex items-start gap-4" ref={dropdownRef}>
            <label className="w-18 text-slate-700 font-medium shrink-0 pt-2">
              参数选择
            </label>
            <div className="flex-1 space-y-2 relative">
              {/* 参数选择点击框 (带开合小箭头) */}
              <div
                onClick={() => setIsParamDropdownOpen(!isParamDropdownOpen)}
                className={`w-full px-3 py-2 bg-white border rounded text-slate-800 text-xs flex items-center justify-between cursor-pointer shadow-2xs transition-all ${
                  isParamDropdownOpen
                    ? 'border-blue-500 ring-1 ring-blue-500'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="font-mono text-slate-900 font-medium">
                  {isCustomParam ? customParamText || '自定义参数' : selectedParam}
                </span>
                {isParamDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </div>

              {/* 分组下拉弹层 (完全复刻图示中「路径参数」与「请求体参数」的规则与层级) */}
              {isParamDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto py-1 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                  {effectiveGroups
                    .filter((group) => group.params.length > 0)
                    .map((group) => (
                      <div key={group.groupName} className="py-1">
                        {/* 分组标题 (图示中置灰弱化标题：路径参数 / 请求体参数) */}
                        <div className="px-3 py-1 text-[11px] font-medium text-slate-400 bg-slate-50/70 select-none">
                          {group.groupName}
                        </div>

                        {/* 分组下各参数选项 */}
                        <div className="space-y-0.5 mt-0.5">
                          {group.params.map((param) => {
                            const isSelected =
                              !isCustomParam && selectedParam === param;
                            return (
                              <div
                                key={param}
                                onClick={() => {
                                  setSelectedParam(param);
                                  setIsCustomParam(false);
                                  setIsParamDropdownOpen(false);
                                }}
                                className={`px-4 py-1.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <span>{param}</span>
                                {isSelected && (
                                  <span className="text-[10px] text-blue-100 font-normal">
                                    已选
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                  {/* 自定义参数选项 */}
                  <div className="pt-1">
                    <div
                      onClick={() => {
                        setIsCustomParam(true);
                        setIsParamDropdownOpen(false);
                      }}
                      className="px-4 py-1.5 text-xs text-blue-600 hover:bg-blue-50 cursor-pointer font-medium"
                    >
                      + 自定义输入其他参数...
                    </div>
                  </div>
                </div>
              )}

              {/* 若选了自定义参数，展示输入框 */}
              {isCustomParam && (
                <input
                  type="text"
                  value={customParamText}
                  onChange={(e) => setCustomParamText(e.target.value)}
                  placeholder="请输入参数名称"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono shadow-2xs mt-1"
                />
              )}
            </div>
          </div>

          {/* 行 2: 值选择 + 任意值开关 */}
          <div className="flex items-center gap-4">
            <label className="w-18 text-slate-700 font-medium shrink-0">
              值选择
            </label>
            <div className="flex-1 flex items-center gap-3">
              {/* 下拉选择 / 自定义输入 */}
              <div className="flex-1">
                {isAnyValue ? (
                  <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 text-xs cursor-not-allowed font-medium select-none">
                    任意值 (*)
                  </div>
                ) : isCustomValue ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customValueText}
                      onChange={(e) => setCustomValueText(e.target.value)}
                      placeholder="请输入具体匹配值"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomValue(false)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px] shrink-0 cursor-pointer"
                    >
                      选择预设
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedValue}
                    onChange={(e) => {
                      if (e.target.value === '__custom_val__') {
                        setIsCustomValue(true);
                      } else {
                        setSelectedValue(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="">请选择</option>
                    <option value="0000">0000 (成功)</option>
                    <option value="01">01 (处理中)</option>
                    <option value="99">99 (失败)</option>
                    <option value="SMART_BRANCH">SMART_BRANCH</option>
                    <option value="VTM_DEVICE">VTM_DEVICE</option>
                    <option value="TRUE">TRUE</option>
                    <option value="FALSE">FALSE</option>
                    <option value="__custom_val__">+ 自定义输入值...</option>
                  </select>
                )}
              </div>

              {/* 任意值 开关 (图1风格) */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-600 font-medium text-xs">任意值</span>
                <div
                  onClick={() => setIsAnyValue(!isAnyValue)}
                  className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    isAnyValue ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-xs flex items-center justify-center transform transition-transform ${
                      isAnyValue ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  >
                    {!isAnyValue && (
                      <X className="w-2.5 h-2.5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮栏 (参考高级配置浅色系弹窗: 取消与确认按钮) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-300 rounded transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium shadow-xs cursor-pointer"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};
