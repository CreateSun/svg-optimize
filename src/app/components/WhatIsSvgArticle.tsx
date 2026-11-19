import Link from "next/link";

export const whatIsSvgFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is an SVG a picture or a text file?",
    answer:
      "It is both: a picture described by a text file. A browser reads the XML markup and draws the result, while a text editor shows the instructions. If you are asking what is svg because a downloaded image opens as code, that is the expected underlying format.",
  },
  {
    question: "Does an SVG get blurry when it is scaled up?",
    answer:
      "Its vector shapes can scale up without the pixelation caused by enlarging a fixed pixel grid. However, a photograph embedded in the file still has a limited resolution and can become blurry. Deliberate blur effects and the way thin lines align with screen pixels also affect appearance.",
  },
  {
    question: "Is an SVG always smaller than a PNG?",
    answer:
      "No. A few shapes may take little text to describe, but complex paths, embedded photographs, and extra markup can produce a large file. Tracing a photograph can add thousands of coordinates. Compare suitable exports of the actual artwork instead of choosing by the file extension alone.",
  },
  {
    question: "Can browsers display SVG without a plugin?",
    answer:
      "Yes. Modern browsers have built-in support for displaying SVG files, including through an HTML image element. Visitors do not need a separate viewer or browser plugin. Check the finished page because fonts, external resources, and the way the image is included can still influence what appears.",
  },
  {
    question: "Should a design-tool SVG be optimized before it is published?",
    answer:
      "Usually it is worth checking an export for unnecessary markup before publication. Keep an editable original, inspect the smaller version, and test it where it will be used. Some changes affect the drawing or its references. You can review cleanup on your device before replacing the file.",
  },
];

export function WhatIsSvgArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <p>
        If you looked up what is svg, the short answer is that it is a vector
        image format written as text. The letters stand for Scalable Vector
        Graphics. The file describes shapes instead of storing a grid of pixels,
        giving a browser instructions for drawing an image at the size you need.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Drawing instructions, not pixels
        </h2>
        <p>
          Imagine a circle described by its center, radius, and color. Those few
          instructions are enough to draw it on a small button or a large banner.
          SVG uses basic shapes such as circles, rectangles, and lines, plus
          paths that describe more complicated outlines with straight segments
          and curves. Groups collect related elements so they can share styling
          or move together.
        </p>
        <p>
          When the image grows, the browser redraws those vectors at the new
          scale; it does not stretch a fixed set of colored squares. The vectors
          therefore do not pixelate when enlarged. Text can remain text, rather
          than becoming outlines, although its appearance depends on the
          available font. A file can also embed a photograph. That photograph is
          still a raster image with a fixed number of pixels, even inside a
          vector document.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What is inside the file
        </h2>
        <p>
          Open the file in a text editor and you will see XML markup. The root{" "}
          <code>svg</code> element contains the drawing. Its <code>xmlns</code>{" "}
          namespace identifies the SVG vocabulary, so software knows how to
          interpret the elements. A <code>viewBox</code> defines the coordinate
          system used by the artwork. Optional <code>width</code> and{" "}
          <code>height</code> attributes specify dimensions; the page can also
          influence the displayed size.
        </p>
        <p>
          Inside that root, paths and other elements describe the visible
          content. Presentation attributes such as <code>fill</code> and{" "}
          <code>stroke</code>, or CSS rules, determine colors and outlines. A
          design tool may add comments, metadata, and editor namespaces that
          preserve information for its own workflow. These design-tool leftovers
          are why a simple icon can be larger than expected: some of the text
          supports editing rather than the final drawing.
        </p>
        <p>
          You can use{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>{" "}
          to remove that extra markup locally. Files are not uploaded for that
          optimization. If you want to change the markup by hand, the{" "}
          <Link
            href="/svg-edit"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG Editor
          </Link>{" "}
          lets you work with the source and see the drawing. Keep the exported
          original so you can return to its editable structure when needed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          When an SVG is the right file
        </h2>
        <p>
          SVG suits logos, icons, illustrations, and interface graphics built
          from clear shapes. One drawing can serve a navigation bar and a larger
          feature panel without requiring separate pixel dimensions for each
          use. Flat colors, curves, and geometric patterns are natural fits.
          Scalable artwork is especially useful when a layout adapts to different
          screens or visitors zoom into the page.
        </p>
        <p>
          Photographs belong in raster formats such as PNG or JPEG. They contain
          fine textures and changing colors that are expensive to describe as
          individual shapes. Tracing a photo into paths can make a larger, slower
          file than a PNG, while changing its appearance. Asking what is svg
          useful for is therefore a question about the artwork, not just the
          filename: choose it for drawings that benefit from vector structure.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How a page uses an SVG
        </h2>
        <p>
          An <code>img</code> element can point to a separate SVG file, much like
          another image format. The file is cached separately from the page, and
          the element can provide alternative text describing meaningful artwork.
        </p>
        <p>
          Inline markup places the drawing directly in the HTML document. Its
          elements can be styled by the page CSS, which is useful when a graphic
          needs to share interface colors or respond to a component state.
        </p>
        <p>
          A CSS background can use an SVG for decoration, such as a repeating
          pattern. Background images do not provide image alternative text, so
          essential information should also appear in the page content.
        </p>
        <p>
          An <code>object</code> element can load a separate SVG document, while
          an SVG <code>image</code> reference can include another image within a
          drawing. Choose the approach that fits the document structure and test
          any resources the referenced file needs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Making a large SVG smaller
        </h2>
        <p>
          Start by considering what occupies the file: editing data, repeated
          styling, long paths, or an embedded photograph. Removing unnecessary
          markup can help, but it cannot turn a detailed photograph into a simple
          vector drawing. For several files, use{" "}
          <Link
            href="/svg-compressor"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG Compressor
          </Link>{" "}
          and review each result separately before saving it.
        </p>
        <p>
          Preview the result before replacing the original, then check it at the
          sizes used on your page. Rounding coordinates and removing attributes
          can change curves, colors, sizing, or references. Keep useful text and
          accessibility information in mind as well. A smaller download is only
          an improvement when the graphic still looks and works as intended.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {whatIsSvgFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
