import React from "react";

export const Introduction = ({
  t,
}: {
  t: (key: string) => string | { [key: string]: string };
}) => {
  const translation = t("introduction") as { [key: string]: string };
  return (
    <section className="bg-white sm:p-10 rounded-lg shadow p-6 mb-8  max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {translation.whyChoose}
      </h2>
      <ol className="list-decimal pl-6 space-y-4 text-gray-800">
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.totalFree_title}
          </p>
          {translation.totalFree}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.noSizeLimit_title}
          </p>
          {translation.noSizeLimit}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.safeAndSecure_title}
          </p>
          {translation.safeAndSecure}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.fastProcessing_title}
          </p>
          {translation.fastProcessing}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.highQualityCompression_title}
          </p>
          {translation.highQualityCompression}
        </li>
        <li className="bg-gray-50 rounded p-4">
          <p className="font-semibold text-blue-600">
            {translation.flexibleConfiguration_title}
          </p>
          {translation.flexibleConfiguration}
        </li>
      </ol>
    </section>
  );
};
