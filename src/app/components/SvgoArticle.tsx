import Link from "next/link";

export const svgoFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is this website the official SVGO project?",
    answer:
      "No. This website provides a browser interface around a bundled optimizer. Its controls and processing workflow belong to this site. References to svgo explain the underlying optimization approach; they do not mean this website publishes the official project or provides the same environment as every command-line installation.",
  },
  {
    question: "Does SVGO upload my SVG?",
    answer:
      "In this browser tool, optimization reads and processes the file locally without uploading its contents for that step. The site still loads scripts, including analytics and ads. A command-line installation processes files in the environment where you run it; any surrounding automation determines where those files are stored or transferred.",
  },
  {
    question: "Will the optimized file look the same?",
    answer:
      "That is not guaranteed. A change to numeric precision can affect a contour, and a removed identifier can change how page styles reach the artwork. Compare the drawing before and after processing, including small details. Also check its accessible text, sizing, and any interactions in the destination page.",
  },
  {
    question: "Why does the command line produce a different file?",
    answer:
      "Your installed svgo version, configuration, and enabled transformations can differ from this site's bundle and switches. These differences may affect path rewriting, attribute order, numeric precision, and the resulting bytes. Compare versions and settings using the same input before assuming that one output is incorrect simply because the files differ.",
  },
  {
    question: "Which switches should stay off?",
    answer:
      "Keep viewBox removal off for assets that depend on its scaling coordinates, and keep dimension removal off when explicit dimensions are needed. Disable ID cleanup for referenced identifiers, and disable title or description removal when that text serves accessibility. Leave other removal options off until you understand what they would discard.",
  },
];

export function SvgoArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <p>
        SVGO is an open-source SVG optimizer that rewrites the markup of a
        drawing so the file can be smaller. When people discuss svgo, they may
        mean the optimizer itself, a command-line installation, or an interface
        built around it. This site is a browser interface that runs a bundled
        optimizer. It is not the official SVGO project, and its controls describe
        this particular browser workflow.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">What it rewrites</h2>
        <p>
          A drawing exported from an editor can carry comments, metadata, and
          editor namespaces alongside the visible geometry. Cleanup can remove
          these additions, unused definitions, and empty containers. This reduces
          the amount of markup a file needs to carry. Whether there is much to
          remove depends on how the source was produced and whether it has
          already been processed.
        </p>
        <p>
          Other transformations change the representation of visible content.
          They can produce shorter colors, simpler numbers, and more compact
          paths. A curve may be expressed with fewer characters, or repeated
          structure may be consolidated. These operations work on the document
          and its geometry; the optimizer does not redraw the artwork by hand or
          judge which visual details matter to your design.
        </p>
        <p>
          The result is not guaranteed identical. Removing a comment has a
          different effect from rounding a coordinate or changing a reference.
          Treat an svgo result as a candidate to inspect, especially when the
          drawing contains fine outlines, shared definitions, or interactive
          elements. A file size comparison tells you about the output length,
          but it cannot establish that the asset still behaves correctly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Browser and command line
        </h2>
        <p>
          Here, files are read in the browser and are not uploaded for
          optimization. The browser interface provides controls and previews so
          you can examine a drawing while choosing settings. The site still
          loads its own scripts, including analytics and ads. Local processing
          of the SVG should therefore not be read as a claim that visiting the
          website causes no network activity.
        </p>
        <p>
          The command line uses the svgo version and configuration you install.
          It suits scripts and CI because a project can record its chosen
          settings and apply them during repeatable tasks. That arrangement
          requires maintaining the installed tool and deciding which files the
          automation processes. This page installs nothing and does not create
          a command-line configuration for you.
        </p>
        <p>
          Versions and output bytes can differ between the browser bundle and
          your terminal. Matching an option name is not enough to establish
          identical behavior across versions. When moving a workflow into a
          build script, begin with a known source file and compare the complete
          result. Record the tool version and configuration together so later
          changes can be understood.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Switches that change more than size
        </h2>
        <p>
          Cleanup of IDs can break CSS or script references that identify parts
          of the drawing. A preview may look acceptable while an interaction on
          the destination page stops finding its target. Removing title and
          description elements can also remove accessibility text. ID cleanup,
          title removal, and description removal all start on in this browser
          tool. Review them before accepting an asset that relies on those
          identifiers or descriptions.
        </p>
        <p>
          Remove viewBox and Remove dimensions start off. The first affects the
          drawing&apos;s coordinate mapping; the second removes explicit sizing
          attributes. Read{" "}
          <Link
            href="/svg-viewbox"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG viewBox
          </Link>{" "}
          for why the coordinate box matters. A responsive layout can depend on
          that mapping even when the SVG appears correct at a single fixed
          size. Keep the dimensions too when the receiving page expects them.
        </p>
        <p>
          Path numbers are rounded to 3 decimal places, and there is no slider
          for changing that precision. Rounding can affect tiny features or
          closely spaced edges, so inspect the parts most sensitive to small
          coordinate differences. Enlarging a preview can reveal a changed
          contour, while viewing the final display size shows whether narrow
          strokes still read clearly.
        </p>
        <p>
          Reset turns every switch off and does not restore defaults. To return
          to a chosen combination, you must select those options again. It is
          also not a promise of recovering the exact original bytes: the
          processing wrapper removes empty style and definition tags. Keep the
          input file separately as the reference for future comparisons.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Where to use it here
        </h2>
        <p>
          Open{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>{" "}
          for one file and a preview. Start with an asset whose appearance you
          know, inspect the enabled switches, and compare the processed drawing
          with its source. Save a result only after checking the details and
          references that matter for its intended use.
        </p>
        <p>
          Use{" "}
          <Link
            href="/svg-compressor"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG Compressor
          </Link>{" "}
          for several files. Each is downloaded on its own, with no zip. Shared
          settings can affect different drawings differently, so examine every
          result rather than assuming one successful preview validates the
          collection. The browser workflow is most useful when that individual
          inspection is part of your process.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {svgoFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
