import Link from "next/link";

export const svgVsPngFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is SVG better than PNG?",
    answer:
      "It depends on the picture and its destination. SVG is useful for artwork expressed as curves and shapes, especially when its size changes. PNG preserves a particular pixel image, which suits screenshots and detailed raster artwork. Choose by checking the exported image in the place where people will see it.",
  },
  {
    question: "Does SVG support transparency?",
    answer:
      "Yes. Areas without painted artwork can be transparent, and shapes can use partial opacity. PNG can also store transparent and partly transparent pixels. Neither file needs a white background, although an export may contain one. Inspect the image against both light and dark surfaces before assuming its background is transparent.",
  },
  {
    question: "Why does my SVG look blurry?",
    answer:
      "The file may contain an embedded raster image, a blur effect, or very thin strokes landing between screen pixels. Vector geometry does not prevent those situations. Check what the file contains and compare it at its intended display size. Increasing the size of an embedded photograph cannot create missing photographic detail.",
  },
  {
    question: "Can I turn a photo into an SVG here?",
    answer:
      "No. This site does not trace photographs or convert PNG files into SVG. Placing a photo inside SVG markup elsewhere would still leave it as a pixel image. Creating a vector interpretation requires drawing or tracing tools, and the result can change the appearance while adding substantial path data.",
  },
  {
    question: "Should I export a logo as SVG or PNG?",
    answer:
      "Choose SVG when the logo is vector artwork and the destination accepts that format. Export a PNG at suitable pixel dimensions when a service requires raster images or you need a fixed rendering. Keeping the editable vector original makes it easier to produce both versions without rebuilding the logo later.",
  },
];

export function SvgVsPngArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <p>
        The useful way to read svg vs png is as a choice between drawing
        instructions and a grid of pixels. Both formats can put the same subject
        on a page, but they preserve different information. Start with the kind
        of artwork you have, the sizes it must support, and the file types your
        destination accepts.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How the two files store an image
        </h2>
        <p>
          SVG is XML text containing shapes, paths, text, and groups. A curved
          outline is described through coordinates and drawing commands. A group
          can collect parts of a symbol, while text can retain its characters.
          The browser interprets those instructions to paint the final image.
          The source can therefore describe relationships between elements as
          well as their appearance.
        </p>
        <p>
          PNG is a raster format: it stores a rectangular grid of pixels using
          lossless compression. Each pixel contributes color information, and
          the file can store transparency. It records the finished picture
          rather than a collection of editable curves. A screenshot saved as PNG
          preserves the captured pixel arrangement, including small text and
          interface details at that capture resolution.
        </p>
        <p>
          An SVG can contain a photograph, but that photograph is still pixels.
          The surrounding XML does not give it new detail or convert it into
          geometry. When comparing svg vs png, inspect the contents rather than
          trusting the extension to tell you whether every part is scalable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">Scaling</h2>
        <p>
          Vector shapes stay sharp when enlarged because the renderer draws
          their outlines again at the requested size. A symbol can move from a
          compact toolbar to a presentation without needing a new grid of source
          pixels. Screen rendering still matters: a narrow diagonal may show
          softened edges as the browser distributes its coverage across pixels.
        </p>
        <p>
          A PNG looks soft when stretched past its pixel grid because the
          display must fill space between the available samples. Exporting more
          pixels can support a larger display, but enlarging an existing small
          PNG does not recover information that was never recorded. This is not
          a quality contest; these are two different representations, each with
          a useful role.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Which artwork fits which file
        </h2>
        <p>
          Logos, icons, flat illustrations, and interface graphics often fit
          SVG. Their edges and areas of color can be expressed with relatively
          simple geometry. A navigation icon that appears at several sizes is a
          good candidate, as is a diagram whose lines should remain clear when
          readers zoom in. Check any fonts and effects used by the original
          artwork during export.
        </p>
        <p>
          Photographs, screenshots, and images with fine texture usually fit PNG
          better in this comparison. Hair, foliage, and fabric contain many
          small color changes that a pixel grid records directly. Tracing a
          photo into paths can create a larger, slower file because thousands of
          outlines may be needed to approximate those changes. The traced image
          can also lose subtle detail or acquire a visibly illustrated style.
        </p>
        <p>
          The destination adds another constraint. A document system might
          accept only raster uploads, while a responsive website may benefit
          from a vector logo. Decide what must survive the export, then check
          whether the receiving application supports it. The svg vs png choice
          should serve that particular use.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">File size</h2>
        <p>
          Neither format has a guaranteed size advantage. A few geometric shapes
          can be described by a short SVG, while a complex trace can require a
          long list of coordinates. A large embedded photo adds its own image
          data too. Either case can make the SVG bigger than a PNG showing the
          same picture.
        </p>
        <p>
          Compare the actual exports at dimensions suitable for the intended
          use. Include the detail you need in both versions, then inspect their
          appearance and file sizes together. A tiny PNG that becomes unreadable
          in the final layout is not an equivalent replacement for a clear
          vector drawing. Likewise, extra geometry offers little benefit when
          the source is photographic.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What this site does not do
        </h2>
        <p>
          This site does not convert PNG to SVG or SVG to PNG. For an explanation
          of the vector format itself, read{" "}
          <Link
            href="/what-is-svg"
            className="text-blue-700 underline underline-offset-4"
          >
            What Is SVG
          </Link>
          . Conversion and tracing are separate tasks from reducing the markup
          of an existing vector file.
        </p>
        <p>
          If you already have an SVG, use{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>{" "}
          for reducing extra markup in that file. Files are not uploaded for
          that step. Save the source separately and compare the result before
          replacing it; cleanup does not decide which image format your artwork
          should use.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {svgVsPngFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
