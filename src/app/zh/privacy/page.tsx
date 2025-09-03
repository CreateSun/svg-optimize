import { Metadata } from "next";
import Link from "next/link";

const I18N = {
  title: "隐私政策",
  description:
    "了解 SVG-Optimize 如何保护您的隐私。我们不收集或存储您的数据，所有处理都在您的浏览器中进行。",
  lastUpdate: "2024年6月12日",
  content: {
    introduction: {
      title: "引言",
      description:
        "欢迎使用 SVG-Optimize！我们致力于保护您的隐私。本隐私政策旨在说明我们处理信息的原则。您的信任对我们至关重要，我们承诺在运营中保持透明。",
    },
    principle: {
      title: "核心原则：我们不收集您的数据",
      description:
        "我们的服务以隐私为核心而设计。我们不会收集、存储、记录或分享您所处理文件中的任何个人信息或数据。",
    },
    howToProcess: {
      title: "您的文件如何被处理",
      description:
        "所有处理都在您的本地浏览器中完成。当您上传 SVG 文件进行优化时，文件不会被发送到我们的服务器。整个优化过程均在您自己的计算机上，通过在浏览器中运行的 JavaScript 来执行。您的文件永远不会离开您的设备，这确保了您对数据的完全隐私和控制。",
    },
    informationWeDoNotCollect: {
      title: "我们不收集的信息",
      description: `为明确起见，我们不收集以下任何信息：`,
      list: [
        "您的姓名、电子邮件地址或任何其他个人身份信息。",
        "您 SVG 文件的内容或其中的任何数据。",
        "IP 地址或任何关于您设备或位置的信息。",
      ],
    },
    cookiesAndLocalStorage: {
      title: "Cookies 和本地存储",
      description:
        "SVG-Optimize 使用您浏览器的本地存储来保存您的配置设置（例如您偏好的 SVGO 插件选项），以便在您下次访问时记住您的选择，从而改善用户体验。这些信息仅存储在您的计算机上，我们无法访问。我们不使用 Cookies 进行追踪或分析。",
    },
    thirdPartyAnalysis: {
      title: "第三方分析",
      description:
        "我们不使用任何第三方分析服务（如 Google Analytics）。我们无意追踪您在本网站上的任何活动。",
    },
    privacyPolicyChanges: {
      title: "隐私政策的变更",
      description:
        "我们可能会不时更新本隐私政策。任何变更都将在此页面上发布，并附上更新的修订日期。我们鼓励您定期查看本政策，以了解我们如何保护您的隐私。",
    },
    contactUs: {
      title: "联系我们",
      description:
        "如果您对本隐私政策有任何疑问，请随时通过 svgoptimizeoffice@gmail.com 与我们联系。",
    },
  },
};

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "了解 SVG-Optimize 如何保护您的隐私。我们不收集或存储您的数据，所有处理都在您的浏览器中进行。",
};

export default function Privacy() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{I18N.title}</h1>
      <p className="mb-4">最后更新于: {I18N.lastUpdate}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.introduction.title}
          </h2>
          <p>{I18N.content.introduction.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.principle.title}
          </h2>
          <p>{I18N.content.principle.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.howToProcess.title}
          </h2>
          <p>{I18N.content.howToProcess.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.informationWeDoNotCollect.title}
          </h2>
          <p>{I18N.content.informationWeDoNotCollect.description}</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            {I18N.content.informationWeDoNotCollect.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.cookiesAndLocalStorage.title}
          </h2>
          <p>{I18N.content.cookiesAndLocalStorage.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.thirdPartyAnalysis.title}
          </h2>
          <p>{I18N.content.thirdPartyAnalysis.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.privacyPolicyChanges.title}
          </h2>
          <p>{I18N.content.privacyPolicyChanges.description}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            {I18N.content.contactUs.title}
          </h2>
          <p>{I18N.content.contactUs.description}</p>
        </section>

        <section className="text-center text-sm text-gray-500 py-4 pt-8 gap-4 flex justify-center">
          <Link className="text-blue-600 hover:text-gray-700" href="/">
            Home
          </Link>
          <Link
            className="text-blue-600 hover:text-gray-700"
            href="/zh/privacy"
          >
            {I18N.title}
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-gray-500">© 2025 SVG Optimizer</span>
        </section>
      </div>
    </main>
  );
}
