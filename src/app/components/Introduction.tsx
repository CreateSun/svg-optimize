import React from "react";

export const Introduction = ({
  t,
}: {
  t: (key: string) => string | { [key: string]: string };
}) => {
  const translation = t("introduction") as { [key: string]: string };
  return (
    <section className="rounded-lg shadow px-4 mb-8  max-w-4xl pt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {translation.whyChoose}
      </h2>
      <ol className=" space-y-4 text-gray-800">
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            1. {translation.totalFree_title}
          </h3>
          {translation.totalFree}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            2. {translation.noSizeLimit_title}
          </h3>
          {translation.noSizeLimit}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            3. {translation.safeAndSecure_title}
          </h3>
          {translation.safeAndSecure}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            4. {translation.fastProcessing_title}
          </h3>
          {translation.fastProcessing}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            5. {translation.highQualityCompression_title}
          </h3>
          {translation.highQualityCompression}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold text-blue-600 pb-2">
            6. {translation.flexibleConfiguration_title}
          </h3>
          {translation.flexibleConfiguration}
        </li>
      </ol>
    </section>
  );
};
