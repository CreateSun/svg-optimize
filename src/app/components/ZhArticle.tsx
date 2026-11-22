export type ZhFaq = {
  question: string;
  answer: string;
};

export const zhFaqs: readonly ZhFaq[] = [
  {
    question: "在线压缩 SVG 会不会损坏文件？",
    answer:
      "可能会。删除无用标记通常看不出变化，但坐标取整、路径简化和删除元素都可能影响渲染结果。下载前先用预览和原图对比，并在实际使用尺寸下检查。任何工具都无法保证每个文件的视觉效果完全一致。",
  },
  {
    question: "可以一次处理多个 SVG 文件吗？",
    answer:
      "可以。一次选择或拖入多个 SVG 文件，它们会共用同一组参数。每个文件有独立的预览和复制/下载按钮。文件很多时建议分批处理，避免浏览器内存吃紧。",
  },
  {
    question: "这个工具和 SVGO 命令行有什么区别？",
    answer:
      "本站运行的是打包进浏览器的 SVGO 引擎，提供勾选项、预览和复制按钮；命令行版在终端里运行，适合脚本和 CI 流程。两者的引擎版本和配置可能不同，输出不保证逐字节一致。",
  },
  {
    question: "我的 SVG 文件会被上传到服务器吗？",
    answer:
      "优化这一步不会上传文件：文件内容是在你的浏览器里读取和处理的，下载结果也在本地生成。需要说明的是，网站本身仍会加载分析脚本和广告脚本，那些请求与文件内容无关。",
  },
  {
    question: "SVG 压缩能去掉哪些内容？",
    answer:
      "取决于开启的插件：注释、编辑器元数据、未使用的定义、空容器、冗余属性都可能被删除，路径、数字、颜色和样式也可能被重写。能省多少完全取决于源文件，已经精简过的图标可能几乎不变。",
  },
  {
    question: "关掉插件后能还原吗？",
    answer:
      "关掉插件会基于当前会话里保留的原始内容重新计算，但这不是撤销历史。重置按钮是把所有插件关掉，不是恢复默认值。即使全关，处理过程也会去掉空的 style 和 defs 标签，所以输出不一定和输入完全一致。",
  },
  {
    question: "优化会破坏 SVG 里的 CSS 或 JavaScript 引用吗？",
    answer:
      "有可能。cleanupIDs 默认开启，会改写或删除被 CSS、JavaScript 引用的 ID；样式内联和结构合并也可能影响选择器。涉及引用时先关掉相关插件，并放回实际页面测试。",
  },
  {
    question: "有文件大小限制吗？",
    answer:
      "界面没有固定的大小上限，但实际能处理多大取决于浏览器内存、设备性能和图形复杂度。特别大的文件可能让页面卡顿，建议分批导入。",
  },
  {
    question: "这个 SVG 压缩工具是免费的吗？",
    answer:
      "是。无需注册、无需付费，勾选项、预览、多种复制格式和逐个下载都可以直接使用。建议保留原始文件，便于对比和调整参数。",
  },
  {
    question: "压缩后的 SVG 还能继续编辑吗？",
    answer:
      "可以，输出的是标准 SVG 源码。不过优化会改变结构和数字精度，再编辑时看到的路径可能比原来难读。需要在设计工具里继续改的素材，建议先保留一份未压缩版本。",
  },
];

export function SvgOptimizeZhArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          SVG 优化器会改掉什么
        </h2>
        <p>
          SVG 文件里不只有看得见的图形。设计工具导出时会附带编辑器元数据、注释、
          重复属性和多余的分组，这些内容对最终图像没有作用。一次 SVG 优化可以删掉这
          部分开销，并把一些绘制指令改写成更短的形式。能省多少取决于源文件本身，
          已经精简过的图标往往变化很小。
        </p>
        <p>
          把优化结果替换到正式资源之前，先在这里检查一遍：细节、缩放，以及它在页面
          里的实际用法。文件变小只有在视觉、可访问性和交互都不受影响时才有意义。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">怎么用这个工具</h2>
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            在页面上选择文件、把文件拖进来，或直接粘贴 SVG 代码。原文件请另外留一份，
            方便和优化结果对比。
          </li>
          <li>
            在左侧参数面板里勾选插件（手机上点「参数」）。预览和输出会随设置实时更新。
            如果文件里有引用或无障碍文本，先确认对应的开关再决定是否保留结果。
          </li>
          <li>
            复制优化后的代码，或逐个下载文件。复制支持纯 SVG、Base64 和 CSS data-URI
            三种格式，按目标环境选择，然后放回实际场景检查。
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          为什么在浏览器本地处理
        </h2>
        <p>
          选择或拖入的文件由 FileReader 读进当前浏览器会话，粘贴的代码同样只存在于这
          个页面。页面把源码和勾选设置交给内置的 SVGO 引擎，得到优化后的代码；下载用
          Blob 和本地 object URL 生成，复制则直接写入剪贴板。
        </p>
        <p>
          文件在优化环节不会被上传。这条本地处理链路和「加载网站本身」是两回事——
          网站仍会请求分析脚本和广告脚本。页面关闭后会话内容不保留，所以不要把它当成
          文件库使用。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">主要开关都控制什么</h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>文档清理。</strong>删除 doctype、XML 处理指令、注释、元数据、
            编辑器数据、未使用的定义和命名空间，默认开启。空的文本、属性和容器，以及
            只为兼容旧滤镜而存在的隐藏元素和背景，也可以一并清掉。
          </li>
          <li>
            <strong>样式与结构。</strong>属性清理、样式内联与压缩、样式转属性、颜色
            缩写、分组简化、冗余属性清理默认开启；基本图形可能被改写成 path，公共
            属性会在分组和子元素之间移动；路径合并和变换简化也是开启的。这几项都建议
            看一眼渲染结果。
          </li>
          <li>
            <strong>数字与尺寸。</strong>数字清理默认开启，路径坐标固定保留三位小数，
            没有滑杆可调。删除 viewBox 默认关闭，以保留缩放坐标系；删除宽高默认关闭，
            以保留显式尺寸；删除根节点 xmlns 同样默认关闭。
          </li>
          <li>
            <strong>文本与引用。</strong>removeTitle 和 removeDesc 默认开启，会删掉
            无障碍文本，文件需要时就关掉。cleanupIDs 默认开启，可能破坏指向这些 ID 的
            CSS 或脚本引用。接受结果前先检查内外部引用。
          </li>
          <li>
            <strong>可选删除与排序。</strong>删除位图、删除 style 元素、删除 script
            元素、属性排序、清理列表值都默认关闭。删掉整个 style 或 script 元素，和
            精简它周围的标记是两件事，确认内容确实无用再开。
          </li>
        </ul>
        <p>
          「重置」是把所有插件关掉，不是恢复默认值。改勾选会基于当前会话保留的内容
          重新计算，没有撤销历史。即使插件全关，处理过程也会去掉空的 style 和 defs
          标签，所以不要期待输出和输入逐字节相同。
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">常见问题</h2>
        {zhFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
