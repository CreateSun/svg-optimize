import Link from "next/link";

export const nanFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Why does the optimized SVG show NaN in the path data?",
    answer:
      "A NaN in a path is a number the optimizer failed to compute. It is not a valid coordinate, so the browser stops drawing that subpath. It usually comes from an optimizer bug rather than from your file, and in a tested build it appeared when an arc command was written with its two flags joined together, such as 01 instead of 0 1.",
  },
  {
    question: "How can I check whether my optimized SVG is broken?",
    answer:
      "Search the file for the text NaN. In a terminal, grep -c NaN file.svg returns the number of occurrences, and anything above zero is a defect. If you have no terminal, open the file in a text editor and search for NaN. Also render the file in a browser at the size you use on the page, because a path containing NaN can leave a blank area that a small preview hides.",
  },
  {
    question: "Does a smaller file size mean the SVG is still correct?",
    answer:
      "No. A broken file can be smaller than the original because the coordinates were replaced by short text. Compare the drawing, not only the byte count: open the result next to the source at the same display size, and check small details such as narrow strokes, counters inside letters, and curves on the outside edges.",
  },
  {
    question: "Should I keep the original SVG before optimizing?",
    answer:
      "Yes. Keep an untouched copy of every file you process. If the optimizer produces a broken result, the original is the only reliable way to recover, and it also lets you compare versions and report the problem accurately. A version control system or a separate folder both work.",
  },
  {
    question: "Which SVG export style is most likely to trigger this?",
    answer:
      "Files whose paths contain arc commands with the two flag values packed into a single token, for example A1.73 1.73 0 010 17.655 instead of A1.73 1.73 0 0 1 0 17.655. Both forms are valid SVG. Editors and icon libraries that minify output aggressively produce the packed form, so checking the result matters most for those files.",
  },
];

export function NanArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <p>
        An SVG optimizer can return a file that is smaller and still broken. The
        most common sign is the text <code>NaN</code> inside a <code>path</code>{" "}
        element, in place of a coordinate. SVG Optimize is a free browser tool
        for people who need a smaller SVG without uploading the file. This page
        explains what NaN in an SVG means, how to check a file for it, and why a
        preview can look correct while the downloaded file does not.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What NaN in a path actually means
        </h2>
        <p>
          A path is a list of drawing commands followed by numbers. Each command
          says what to draw, and the numbers give the coordinates. Producing the
          file requires a long chain of number handling: parse the values, convert
          relative distances into absolute ones, round them, and print them again.
          NaN is what the optimizer writes when one of those steps produces a
          value that is not a number at all. The string <code>NaN</code> is
          shorter than almost any real coordinate, which is why a broken file can
          still report a smaller size.
        </p>
        <p>
          The browser cannot draw a path that contains this token. Depending on
          where it appears, the result is a missing subpath, a shape with the
          wrong outline, or an empty image. Nothing in the file announces the
          failure: there is no error message and the markup is otherwise
          well-formed, so the file opens without complaint in an editor.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          The arc command with joined flags
        </h2>
        <p>
          When this problem was traced through an older optimizer build, the
          trigger turned out to be a syntax detail in arc commands, not the
          artwork. An arc command, written <code>A</code> for absolute or{" "}
          <code>a</code> for relative, takes seven numbers: two radii, a rotation,
          two flags, and a destination point. The two flags are single digits,
          and SVG allows them to be written without a separating space.
        </p>
        <p>
          Both lines below describe the same arc. The first packs the flags into
          one token; the second separates them.
        </p>
        <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm leading-6">
          <code>{`<path d="M2 2A1 1 0 01 0 2z"/>   <!-- flags written as 01 -->
<path d="M2 2A1 1 0 0 1 0 2z"/> <!-- flags written as 0 1 -->`}</code>
        </pre>
        <p>
          In the tested build, the first form produced{" "}
          <code>a1 1 0 1 0 0 NaN</code> — a coordinate replaced by NaN. The second
          form produced correct output. Two further findings are worth knowing.
          The bug did not reproduce when the output of that build was fed back
          into it, because the optimizer writes flags with a space on the way
          out. And it depended on the input only: the same file could fail in one
          optimizer version and succeed in another, because the parsing and number
          formatting code differs between versions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold">Input form</th>
                <th className="py-2 pr-4 font-semibold">Result in the tested build</th>
                <th className="py-2 font-semibold">What to conclude</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4">
                  <code>A1 1 0 01 0 2</code> (flags joined)
                </td>
                <td className="py-2 pr-4">Coordinate replaced by NaN</td>
                <td className="py-2">Check any file that uses this form.</td>
              </tr>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4">
                  <code>A1 1 0 0 1 0 2</code> (flags separated)
                </td>
                <td className="py-2 pr-4">Correct output</td>
                <td className="py-2">
                  The form is safe in the version tested; still verify the drawing.
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-4">Any file, another optimizer version</td>
                <td className="py-2 pr-4">Not determined</td>
                <td className="py-2">
                  Version matters, so test with the tool you actually use.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Source: the arc command is defined in the{" "}
          <a
            href="https://www.w3.org/TR/SVG11/paths.html#PathDataEllipticalArcCommands"
            className="text-blue-700 underline underline-offset-4"
          >
            W3C SVG path specification
          </a>
          , which states that the flags are single digits and that a comma or
          whitespace separator is optional before them.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Why the preview does not catch it
        </h2>
        <p>
          A preview can be produced from the original markup rather than from the
          optimized output. When that happens, the image on screen is a faithful
          rendering of your source file, displayed next to a size comparison that
          refers to the new bytes. The two halves of the interface describe
          different files, and the difference is invisible until the download is
          opened in a browser.
        </p>
        <p>
          Even a preview built from the real output can miss the damage at the
          wrong scale. Icons are usually shown large in a tool and small on the
          page. A missing subpath inside a letter or a gap in a fine outline is
          easy to overlook at icon size and obvious when the same file is placed
          in a navigation bar at 400 percent zoom. Check the result at the size it
          will actually be used, and check it against the original side by side.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          How to check a file for NaN
        </h2>
        <p>
          The check is a text search, because the defect is a literal string in
          the markup. On macOS or Linux, this prints the count of occurrences per
          file:
        </p>
        <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm leading-6">
          <code>{`grep -c NaN icon.svg
# 0 on a clean file; anything above 0 means a broken path`}</code>
        </pre>
        <p>
          To check a whole folder before publishing, use{" "}
          <code>grep -rc NaN assets/</code>. On Windows PowerShell, the
          equivalent is{" "}
          <code>{`(Select-String -Path .\\*.svg -Pattern NaN).Count`}</code>.
          Without a terminal, open the file in a text editor and search for{" "}
          <code>NaN</code>; a single match is enough to reject the file.
        </p>
        <p>
          A text search catches this defect but not every possible defect. A
          coordinate can be rounded into a slightly different curve, an
          identifier can be removed while page CSS still refers to it, and a
          <code>viewBox</code> can be dropped while the layout expects scaling.
          Those need a visual comparison, which is why both steps belong in the
          review.
        </p>
        <p>
          For an editable check of the markup itself, the{" "}
          <Link href="/svg-edit" className="text-blue-700 underline underline-offset-4">
            SVG Editor
          </Link>{" "}
          opens the source and the drawing together, so a removed attribute or a
          rewritten path can be read rather than guessed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          A short checklist before you replace an asset
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold">Step</th>
                <th className="py-2 font-semibold">What it catches</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-semibold">Search the output for NaN</td>
                <td className="py-2">Coordinates the optimizer failed to compute</td>
              </tr>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-semibold">
                  Compare drawing with source at final display size
                </td>
                <td className="py-2">Changed curves, missing subpaths, lost detail</td>
              </tr>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-semibold">
                  Confirm viewBox and dimensions survived
                </td>
                <td className="py-2">Broken scaling in responsive layouts</td>
              </tr>
              <tr className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 font-semibold">
                  Check ids your CSS or scripts reference
                </td>
                <td className="py-2">Highlight, masking and animation that silently stops</td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-4 font-semibold">
                  Keep the original until the replacement is verified
                </td>
                <td className="py-2">Lost source if the result turns out unusable</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          None of these steps takes long for a single icon, and together they cost
          less than discovering a broken logo on a production page. The size
          number is evidence about bytes, not about correctness.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          What to do with a file that comes back broken
        </h2>
        <p>
          Keep the original and record the optimizer version and the settings you
          used. Try the same file with a different version or with the pass that
          rewrites paths turned off, since that is the pass most likely to be
          responsible. If the file came from an icon library, check whether a
          newer release of the library has been re-exported, because upstream
          fixes sometimes remove the syntax that triggers the problem.
        </p>
        <p>
          In SVG Optimize, Convert path data is one of the switches in the panel.
          Turning it off leaves the path commands as they were written and gives
          up most of the size reduction on path-heavy artwork, so it is a
          fallback rather than a default. For a batch, use{" "}
          <Link
            href="/svg-compressor"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG Compressor
          </Link>{" "}
          and check every result before downloading, because files in the same
          folder can behave differently. Single files can be reviewed on{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>
          .
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {nanFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
