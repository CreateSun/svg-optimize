import Link from "next/link";

export type EnglishFaq = {
  question: string;
  answer: string;
};

export const englishFaqs: readonly EnglishFaq[] = [
  {
    question: "Does optimizing SVG reduce visual quality?",
    answer:
      "It can. Removing unused markup often leaves the appearance unchanged, but rounding coordinates, simplifying paths, or removing elements can affect rendering. Compare the preview with your original and test the result at its intended size. There is no guarantee of identical visuals for every file.",
  },
  {
    question: "Can I optimize multiple SVG files at once?",
    answer:
      "Yes. Select or drop several SVG files together to optimize svg assets with the same checkbox settings. Each file gets its own preview and output controls. Copy or download each result individually, and consider smaller batches if your browser becomes slow.",
  },
  {
    question: "How is this different from the SVGO CLI?",
    answer:
      "This interface runs a bundled SVGO engine in your browser and exposes checkboxes, previews, and copy controls. The SVGO CLI runs from a terminal and suits scripted workflows. Engine versions and configuration can differ, so matching output between the two is not guaranteed.",
  },
  {
    question: "Are my SVG files uploaded?",
    answer:
      "Your files are not uploaded for optimization. File contents are read and processed in the browser, and downloads are generated locally. This describes the optimization workflow; the website still loads resources and includes analytics and advertising scripts that can make network requests.",
  },
  {
    question: "What does an svg optimize pass remove?",
    answer:
      "Depending on the enabled switches, it can remove comments, editor metadata, unused definitions, empty containers, and redundant attributes. It can also rewrite paths, numbers, colors, and styles. The result depends on the source and settings, so a particular size reduction is never promised.",
  },
  {
    question: "Can I undo a plugin's changes?",
    answer:
      "Turning a plugin off recomputes output from the file kept in the current session. This is not an undo history. Reset switches every plugin off rather than restoring defaults. Processing also strips empty style and defs tags, so the output is not guaranteed to be byte-identical to your input.",
  },
  {
    question: "How does SVG optimization differ from PNG or JPEG compression?",
    answer:
      "SVG describes shapes and styling as text, so optimization edits that structure and its numbers. PNG and JPEG encode pixel images and use different compression methods. Embedded raster images can dominate an SVG's size; this tool does not recompress those pixels as a dedicated raster encoder would.",
  },
  {
    question: "Can optimization break CSS or JavaScript references inside an SVG?",
    answer:
      "Yes. ID cleanup is on by default and can change or remove IDs referenced by CSS or JavaScript. Style conversion and structural changes can also affect selectors. Disable the relevant switches and test the SVG in its actual page, where external references and interactions matter.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "The interface does not impose a fixed file size cap. Practical limits still depend on browser memory, device speed, file complexity, and the number of files in a session. Large drawings may take longer or make the page unresponsive; try fewer files at a time.",
  },
  {
    question: "Is this svg optimizer free?",
    answer:
      "Yes. You can use the svg optimizer without paying or creating an account. The available checkbox settings, previews, copy formats, and individual file downloads are free to use. Keep your original files so you can compare results and revisit settings later.",
  },
];

export function EnglishArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What an svg optimize pass removes
        </h2>
        <p>
          SVG files contain more than visible shapes. Design tools may add editor
          metadata, comments, repeated attributes, and groups that are unnecessary
          for the finished image. An svg optimize pass can trim that overhead and
          rewrite some drawing instructions into shorter forms. Savings depend on
          what the source contains; an already compact icon may change very little.
        </p>
        <p>
          Use this svg optimizer to inspect the result before replacing an asset.
          When you optimize svg artwork, check fine details, scaling, and its use
          in the surrounding page. A smaller file is useful only if it still meets
          your visual, accessibility, and interaction requirements.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How to use SVG Optimize
        </h2>
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            Select one or many SVG files with the upload area, drop them onto it,
            or paste SVG markup into the page. Keep the originals separately so
            you can compare them with the processed files.
          </li>
          <li>
            Adjust checkboxes in the left desktop panel, or open the Params button
            on mobile. Watch the preview and output update as settings change.
            To optimize svg files that contain references or accessibility text,
            review the relevant switches before keeping the result.
          </li>
          <li>
            Copy the optimized markup or download each file. The copy controls
            also offer Base64 and CSS/data-URI formats for embedding. Choose the
            format your destination expects, then check the asset in that context.
          </li>
        </ol>
        <p>
          This page is the optimizer; the{" "}
          <Link
            href="/svg-compressor"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG compressor
          </Link>{" "}
          page covers batch runs, the command-line tool, and which switches change
          file size. If a result comes back blank or smaller than it should be,
          the{" "}
          <Link
            href="/svg-nan-path"
            className="text-blue-700 underline underline-offset-4"
          >
            NaN in path data
          </Link>{" "}
          page shows how to check for the one failure this tool will not report
          on its own. To understand what the coordinate box in your file
          actually does, read{" "}
          <Link
            href="/svg-viewbox"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG viewBox
          </Link>
          ; to compare formats before you commit, see{" "}
          <Link
            href="/svg-vs-png"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG vs PNG
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Why this svg optimizer runs locally
        </h2>
        <p>
          For selected or dropped files, FileReader reads the text into the current
          browser session. Pasted markup enters that session directly. The page
          passes the source and selected settings to window.svgo, which produces
          the optimized markup. Downloads use a Blob and a local object URL; copy
          actions write the selected output to the clipboard.
        </p>
        <p>
          Files are not uploaded for optimization. That local processing path is
          separate from loading the website and its resources, including analytics
          and ads. Processing time depends on the drawing and your device. Keep
          source files outside the page because session contents are not a
          permanent file library.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What the main switches control
        </h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Document cleanup.</strong> Removing doctypes, XML processing
            instructions, comments, metadata, editor data, unused definitions, and
            unused namespaces is on by default. Empty text, attributes, and
            containers can also be removed, as can hidden elements and backgrounds
            that are only there to enable an old filter effect.
          </li>
          <li>
            <strong>Styles and structure.</strong> Attribute cleanup, style
            inlining and minification, style conversion to attributes, color
            shortening, group simplification, and redundant attribute cleanup are
            on by default. Basic shapes can be rewritten as paths, and shared
            attributes can move between a group and its children. Path merging and
            transform simplification are also on. These changes warrant a visual
            check.
          </li>
          <li>
            <strong>Numbers and sizing.</strong> Numeric cleanup is on, and path
            coordinates are rounded to three decimal places. That precision is fixed;
            there is no slider for it. ViewBox removal is off to keep the coordinate
            system used for scaling. Dimension removal is off to keep explicit width
            and height. Root xmlns removal is off as well.
          </li>
          <li>
            <strong>Text and references.</strong> removeTitle and removeDesc are
            on by default and can remove accessibility text. Turn them off when
            the file needs its title or description. cleanupIDs is also on and
            can break CSS or script references that point at those IDs. Check
            embedded and surrounding references before accepting changes.
          </li>
          <li>
            <strong>Optional removals and ordering.</strong> Raster image removal,
            style element removal, script element removal, attribute sorting, and
            list value cleanup are off by default. Removing an entire style or
            script element is different from simplifying its surrounding markup;
            enable those options only when that content is unnecessary.
          </li>
        </ul>
        <p>
          Reset turns every plugin off; it does not restore defaults. Changing a
          checkbox recomputes from the file retained in the current session, without
          keeping an undo history. Even with plugins off, processing strips empty
          style and defs tags, so do not expect byte-identical output.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {englishFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
