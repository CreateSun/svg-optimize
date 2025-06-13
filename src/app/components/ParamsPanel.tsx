import { usePathname } from "next/navigation";
import React from "react";

type Param = {
  id: string;
  name: string;
  name_en: string;
  active: boolean;
};

type ParamsPanelProps = {
  params: Param[];
  onChange: (id: string, active: boolean) => void;
  onReset: () => void;
  t: (key: string) => string;
};

const ParamsPanel: React.FC<ParamsPanelProps> = ({ params, onChange, onReset, t }) => {
  const pathname = usePathname()
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  // 具体逻辑后续实现
  return (
    <div className="flex flex-col h-full text-base">
      {/* 吸顶区：标题+重置按钮 */}
      <div className="sticky top-0 z-20 bg-white min-h-16 flex-shrink-0 flex flex-col gap-2 justify-center shadow border-b px-4 pb-4">
        <div className="font-semibold text-lg">{t("params")}</div>
        <button
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-base font-medium self-start"
          onClick={onReset}
          type="button"
        >
          {t("reset")}
        </button>
      </div>
      {/* 参数列表滚动区 */}
      <ul className="space-y-3 flex-1 overflow-y-auto mt-2 px-4 pb-4">
        {params.map(param => (
          <li key={param.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              id={param.id}
              checked={param.active}
              onChange={e => onChange(param.id, e.target.checked)}
              className="accent-blue-600 w-5 h-5"
            />
            <label htmlFor={param.id} className="text-gray-700 cursor-pointer text-base">{locale === "zh" ? param.name : param.name_en}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParamsPanel; 