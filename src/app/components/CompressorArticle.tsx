import Link from "next/link";

export const compressorFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Can I compress a folder of SVGs at once?",
    answer:
      "Select the SVG files inside the folder, or drop several files together. The interface accepts multiple files but does not provide a folder picker or recursively scan subfolders. They share one set of switches, and you save each result separately. Use smaller groups if browser memory becomes a constraint.",
  },
  {
    question: "Does the svg compressor upload my files?",
    answer:
      "No. Selected files are read on your device, and pasted markup is processed in the browser too. Copying and downloading use the locally generated result. The website still requests its own resources and runs analytics and advertising scripts; local file processing does not mean the entire website makes no network requests.",
  },
  {
    question: "Will the compressed SVG look the same?",
    answer:
      "It may, but identical appearance is not guaranteed. Rounding, path rewrites, and removals can change details, while ID or style changes can affect the surrounding page. Inspect every preview, then test the downloaded file at its intended dimensions and in its actual context. Keep the original for comparison.",
  },
  {
    question: "Why is this not the same as running SVGO in a terminal?",
    answer:
      "The browser provides a bundled engine and checkbox controls. A terminal workflow uses the SVGO version you install, with configuration and commands you maintain. Versions and settings can differ, so neither matching bytes nor matching size is assured. The CLI is useful when the same process must run in scripts or CI.",
  },
  {
    question: "Which setting should I leave off?",
    answer:
      "Leave Remove viewBox off when you need the SVG to scale with its coordinate box intact. Also keep optional removals off unless you know the content is unnecessary. For assets with referenced IDs or accessibility text, turn off cleanupIDs, removeTitle, or removeDesc as appropriate, even though those three start enabled.",
  },
];

export function CompressorArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Compress more than one file
        </h2>
        <p>
          Use this svg compressor to work through a collection of icons or
          illustrations together. Select several SVG files in the file chooser,
          or drop them onto the upload area. Every file uses the current checkbox
          settings. Changing a switch updates the files in the session, so review
          the whole collection after an adjustment, especially when the drawings
          came from different sources.
        </p>
        <p>
          Each result has its own preview, size comparison, copy controls, and
          download button. Save the files one by one; there is no zip download or
          job queue. The interface imposes no file-size cap, but browser memory is
          the practical limit. Start with a manageable selection and use fewer
          files if the page becomes slow.
        </p>
        <p>
          Paste accepts one SVG markup string at a time. It is useful for a single
          snippet, while selecting or dropping files is the route for a batch.
          Keep your source files so you can revisit a result later.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How this differs from the SVGO command line
        </h2>
        <p>
          The browser workflow centers on checkboxes and a live preview. You can
          copy each result as SVG markup, Base64, or a CSS data-URI, or download
          its SVG file. This page installs nothing. A browser session suits a
          batch you want to inspect visually while deciding which transformations
          to keep.
        </p>
        <p>
          The SVGO command-line tool runs in a terminal. A config file records
          your chosen transformations, and scripts or CI can apply them as part
          of a repeatable build. That workflow is useful for maintained asset
          directories and automated checks. It requires managing the tool and its
          configuration in your own environment.
        </p>
        <p>
          This svg compressor does not promise the same SVGO version or identical
          output bytes as a terminal installation. Compare settings and results
          before moving a workflow between them. For the related optimizer and
          its general usage guide, visit{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Which switches change the file the most
        </h2>
        <p>
          The biggest opportunity depends on what fills the source file. For an
          editor export, removing comments, metadata, and editor namespaces may
          matter most. Unused defs and empty containers can also add overhead.
          Those cleanup options start on. They mostly address extra markup,
          whereas a drawing dominated by coordinates may benefit more from path
          processing.
        </p>
        <p>
          Style minification, shorter colors, numeric cleanup, path data
          simplification, merged paths, and collapsed groups are also on by
          default. These switches seek more compact representations of the
          drawing. Their relative effect varies: a file with repetitive styling
          differs from one containing long paths. Use the per-file size readout
          to compare adjustments without expecting a particular reduction.
        </p>
        <p>
          Some enabled switches change more than size. cleanupIDs can break CSS
          or script references. removeTitle and removeDesc can remove
          accessibility text. Shapes can be rewritten as paths, and styles can
          be converted to attributes, affecting how you later edit or select
          elements. Check these choices against the way the asset is embedded,
          styled, and used.
        </p>
        <p>
          Other removals stay off unless you enable them. Keeping Remove viewBox
          off preserves the scale box; keeping Remove dimensions off retains
          width and height. Removing the root xmlns, embedded raster images,
          style elements, or script elements is also off by default. Deleting
          such content can remove functionality or visible artwork, so a smaller
          result alone is not a reason to enable those switches.
        </p>
        <p>
          Path numbers are rounded to 3 decimal places. That precision is fixed,
          with no slider to adjust it. Reset turns every plugin off; it does not
          restore the defaults. If you use Reset to compare settings, you must
          select the transformations you want again. Keep the original separately
          rather than treating Reset as a way to recover its exact contents.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {compressorFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
