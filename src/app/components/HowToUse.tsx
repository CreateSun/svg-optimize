import React from "react";
import { useI18n } from "../i18n/useI18n";

/**
 * 使用说明
 * @returns
 */
export default function HowToUse() {
  const t = useI18n();

  // The guide_steps from JSON can be an array of strings.
  const steps = t("guide_steps") as unknown as string[];

  return (
    <div className="mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">{t("how_to_use")}?</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-800">
        {Array.isArray(steps) &&
          steps.map((step, index) => <li key={index}>{step}</li>)}
      </ul>
    </div>
  );
}