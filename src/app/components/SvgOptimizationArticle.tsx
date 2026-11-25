import Link from "next/link";

export const svgOptimizationFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Why does my SVG file get only 1% smaller?",
    answer:
      "Because it is already optimized. Files from icon libraries such as Simple Icons, Lucide or Material Symbols ship pre-minified: no comments, no editor metadata, and coordinates already rounded. In a test of four library icons the savings were 0.8%, 5.7%, 9.4% and 20.4%. Run the same pass on a file exported from Figma and it dropped 55%. The optimizer is doing the same work either way; there is simply less to remove.",
  },
  {
    question: "How much smaller will my SVG get?",
    answer:
      "It depends entirely on how the file was produced. Files exported from design tools carry editor metadata, nested groups, hidden layers and long decimals, so they have the most to lose. Hand-written or library-sourced files have little left. Any tool that promises a fixed percentage is describing its best case, not yours.",
  },
  {
    question: "Does optimizing an SVG reduce image quality?",
    answer:
      "Removing comments, metadata and unused definitions does not change the drawing. Rounding coordinates and rewriting paths can, especially on fine details, thin strokes and tight curves. Compare the result at the size it will actually be displayed, not zoomed in, and check anything that reads as a small visual detail.",
  },
  {
    question: "Are my files uploaded when I optimize them here?",
    answer:
      "No. Files are read and processed in your browser, and the download is generated locally. The website still loads its own scripts, including analytics and advertising, so local file processing does not mean the whole site makes no network requests.",
  },
  {
    question: "Should I optimize SVGs that are already minified?",
    answer:
      "Usually not worth it. If the file came from an icon library, it has probably been through an optimizer already, and you will save a fraction of a percent while taking on the risk of a rounding change. Check the size before and after; if the difference is under 2%, keep the original.",
  },
  {
    question: "Can optimizing break my SVG?",
    answer:
      "Yes, in three common ways. An optimizer can return a file whose path coordinates read NaN, which renders blank with no error. ID cleanup can break url(#...) references when several optimized icons are inlined on the same page. Removing title or description elements can strip accessibility text. All three are avoidable by checking the specific switches and inspecting the result.",
  },
  {
    question: "Do I need to optimize SVG for Core Web Vitals?",
    answer:
      "It helps, but position matters more than size. Inline SVG is part of the HTML response and delays the largest contentful paint on pages where it is the main element. A referenced file competes for bandwidth like any other asset. Optimizing an already-small 1 KB icon will not move any metric; optimizing a 200 KB illustration might.",
  },
  {
    question: "Should I use an optimizer or just gzip?",
    answer:
      "They solve different problems and both apply. Gzip compresses the bytes in transit; an optimizer removes content before it is sent. Since SVG is text with heavy repetition, gzip alone is often substantial, but it cannot remove a path that is not needed. Hosting already applies compression, so what an optimizer changes is the uncompressed size you parse and render.",
  },
  {
    question: "What is the difference between optimizing and compressing an SVG?",
    answer:
      "In everyday use the terms overlap. Strictly, optimization restructures the file, removing what the drawing does not need and rewriting what it does into shorter forms. Compression encodes the same content more densely. This tool does the first; your server's gzip or brotli does the second.",
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes. No account, no upload, no per-file limit beyond what your browser can hold. The switches, the preview, the copy formats and downloading each result are free.",
  },
];

export function SvgOptimizationArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Why your SVG file is bigger than it should be
        </h2>
        <p>
          An SVG is a text file that describes shapes. That means it can carry
          more than the drawing: comments left by the tool that produced it,
          metadata blocks, empty groups, layers the designer hid instead of
          deleted, and coordinates written to six decimal places. None of it
          affects what you see, and all of it is shipped to every visitor who
          loads the page.
        </p>
        <p>
          How much of that overhead exists depends on where the file came from.
          A design-tool export is usually the worst case. A file pulled from an
          icon library has often been through an optimizer already, so there is
          almost nothing left to take out.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How much smaller it actually gets
        </h2>
        <p>
          We ran the same optimizer over five real files, all with default
          settings. The spread is the point:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-0 border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-4 font-medium">Source</th>
                <th className="py-2 pr-4 font-medium">Before</th>
                <th className="py-2 pr-4 font-medium">After</th>
                <th className="py-2 font-medium">Reduction</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Figma export, one shape</td>
                <td className="py-2 pr-4">470 B</td>
                <td className="py-2 pr-4">211 B</td>
                <td className="py-2 font-semibold text-green-700">55.1%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">TypeScript logo (Simple Icons)</td>
                <td className="py-2 pr-4">1,309 B</td>
                <td className="py-2 pr-4">1,042 B</td>
                <td className="py-2 font-semibold text-green-700">20.4%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">React logo (Simple Icons)</td>
                <td className="py-2 pr-4">2,941 B</td>
                <td className="py-2 pr-4">2,664 B</td>
                <td className="py-2 font-semibold text-green-700">9.4%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Figma logo (Simple Icons)</td>
                <td className="py-2 pr-4">1,108 B</td>
                <td className="py-2 pr-4">1,045 B</td>
                <td className="py-2 font-semibold text-green-700">5.7%</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Docker logo (Simple Icons)</td>
                <td className="py-2 pr-4">1,780 B</td>
                <td className="py-2 pr-4">1,766 B</td>
                <td className="py-2 font-semibold text-gray-500">0.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The library icons were already minified when they were published, so
          almost nothing was left to remove. The Figma export still had the
          comment, the wrapper group, a hidden rectangle and coordinates like{" "}
          <code>M24.0000001 4.0000002</code>, and it lost more than half its
          bytes.
        </p>
        <p>
          This is why a compressor that advertises &ldquo;up to 80% smaller&rdquo;
          is not lying, and also why your own file might barely move. The number
          depends on the input, and the only honest answer for a specific file is
          to run it and look.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Which parts of the file get changed
        </h2>
        <p>
          An optimization pass does four kinds of work, and only the last two
          can change what the drawing looks like.
        </p>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Deleting what the drawing does not use.</strong> Comments,
            metadata, doomed-by-default attributes, unused definitions, empty
            containers and editor namespaces. This is always visually safe.
          </li>
          <li>
            <strong>Writing the same thing shorter.</strong> Colours like{" "}
            <code>#ffffff</code> become <code>#fff</code>, groups with one child
            are flattened, styles move inline, attribute order is normalised.
            The rendering is identical.
          </li>
          <li>
            <strong>Rewriting the geometry.</strong> Paths are converted between
            absolute and relative commands, curves are simplified, and numbers
            are rounded to a fixed precision. This is where a thin stroke or a
            tight corner can change.
          </li>
          <li>
            <strong>Removing things that carry meaning.</strong> Title and
            description elements hold the accessible name of the graphic; ID
            cleanup renames identifiers that CSS and scripts may reference.
            Both are removable and both can break something.
          </li>
        </ul>
        <p>
          The switches in this tool are grouped the same way, so you can turn off
          the last two categories and keep only the safe cleanup if you want.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Three ways an optimized SVG comes back broken
        </h2>
        <p>
          None of these produce an error. The file stays valid XML, opens in any
          editor, and looks fine in a thumbnail.
        </p>
        <p>
          <strong>A coordinate becomes NaN.</strong> The path is syntactically
          valid but the browser cannot draw it, so the shape disappears. It is
          worth knowing that a broken file is often <em>smaller</em> than a
          correct one, which is why a size comparison is not a quality check.{" "}
          <Link
            href="/svg-nan-path"
            className="text-blue-700 underline underline-offset-4"
          >
            How to check a file for NaN
          </Link>{" "}
          covers the detection command and the input pattern that triggers it.
        </p>
        <p>
          <strong>An ID reference breaks after inlining.</strong> ID cleanup
          renames <code>gradient1</code> to <code>a</code> and updates every
          reference inside the file, which is correct in isolation. Inline three
          optimized icons on one page and two of them can end up with a gradient
          called <code>a</code>; the first one wins and the others render wrong
          or empty. Keeping ID cleanup off for icons you inline is the simple fix.
        </p>
        <p>
          <strong>The accessible name disappears.</strong> <code>removeTitle</code>{" "}
          and <code>removeDesc</code> start enabled, and a screen reader that was
          announcing the graphic now announces nothing. If the SVG carries
          meaning rather than decoration, leave those two off.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What optimizing will not fix
        </h2>
        <p>
          Optimizing removes redundancy. It does not make an over-complicated
          drawing simple. A traced photograph with 4,000 path commands stays
          expensive after optimization, because every one of those commands is
          doing something. The fix there is fewer commands, not cleaner ones.
        </p>
        <p>
          Embedded raster images are the other case. A bitmap pasted into an SVG
          is base64-encoded inside the file, and the optimizer will not
          re-compress it. If a file is dominated by an embedded image, look at the
          image.
        </p>
        <p>
          And if the file will be served by a normal web server, it is already
          being gzipped on the wire. Optimization reduces the bytes that get
          parsed and rendered; compression reduces the bytes that get transferred.
          They are not substitutes.{" "}
          <Link
            href="/svg-compressor"
            className="text-blue-700 underline underline-offset-4"
          >
            The batch page
          </Link>{" "}
          covers processing several files at once, and{" "}
          <Link
            href="/svg-viewbox"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG viewBox
          </Link>{" "}
          explains the one attribute people most often delete by accident.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {svgOptimizationFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
