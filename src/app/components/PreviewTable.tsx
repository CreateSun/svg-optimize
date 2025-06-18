import React from "react";

type SvgResult = {
  id: string;
  filename: string;
  optimizeSvg: string;
  base64SVG: string;
  encodeSVG: string;
  optimizeRatio: string;
};

type PreviewTableProps = {
  results: SvgResult[];
  onCopy: (id: string, type: "optimize" | "base64" | "encode") => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
};

export default function PreviewTable({
  results,
  onCopy,
  onDownload,
  onDelete,
  t,
}: PreviewTableProps) {
  // 统一textarea样式
  const textareaClass =
    "w-full h-40 border rounded-lg p-3 text-xs font-mono resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all";
  return (
    <div className="overflow-x-scroll sm:w-[350px] md:w-full">
      <table className="min-w-full bg-white rounded shadow text-sm border border-gray-100">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 font-semibold">{t("preview") ?? "预览"}</th>
            <th className="p-2 font-semibold">{t("optimize")}</th>
            <th className="p-2 font-semibold">{t("operation") ?? "操作"}</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-8">
                {t("noResult") ?? "暂无结果"}
              </td>
            </tr>
          ) : (
            results.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-2 min-w-[100px] max-w-[140px] align-middle">
                  <div className="w-24 h-24 flex items-center justify-center overflow-hidden border rounded-lg bg-white mx-auto my-2">
                    <div
                      className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer"
                      dangerouslySetInnerHTML={{ __html: r.optimizeSvg }}
                    />
                  </div>
                </td>
                <td className="p-2 min-w-[400px] align-top">
                  <div className="mb-2 text-green-600 text-xs font-mono">
                    {r.optimizeRatio}
                  </div>
                  <textarea
                    className={textareaClass}
                    readOnly
                    value={r.optimizeSvg}
                  />
                </td>
                <td className="p-2 align-top min-w-[120px]">
                  <div className="flex flex-col gap-2 items-stretch">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm font-medium transition"
                      onClick={() => onCopy(r.id, "optimize")}
                    >
                      {t("copy") + t("optimize")}
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2 text-sm font-medium transition"
                      onClick={() => onDownload(r.id)}
                    >
                      {t("download")}
                    </button>
                    <button
                      className="bg-blue-400 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm font-medium transition"
                      onClick={() => onCopy(r.id, "base64")}
                    >
                      {t("copy") + "Base64"}
                    </button>
                    <button
                      className="bg-blue-400 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm font-medium transition"
                      onClick={() => onCopy(r.id, "encode")}
                    >
                      {t("copy") + "CSS"}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-2 text-sm font-medium transition mt-2"
                      onClick={() => onDelete(r.id)}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
