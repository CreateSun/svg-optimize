import Link from "next/link";

export const svgViewBoxFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the viewBox the same as width and height?",
    answer:
      "No. The viewBox describes a rectangle in the drawing's own coordinates. Width and height help establish the viewport in which that rectangle is displayed, and CSS can control the displayed size too. A drawing can keep its original coordinate values while appearing in several different sizes on a page.",
  },
  {
    question: "What happens if I remove the viewBox?",
    answer:
      "The automatic mapping from the drawing's coordinate rectangle to its viewport is removed. Depending on the remaining dimensions and surrounding layout, the artwork may stop scaling as expected, occupy only part of its box, or become clipped. Compare the image at several sizes before accepting a file without this attribute.",
  },
  {
    question: "What do the four numbers mean?",
    answer:
      "They give the minimum x coordinate, minimum y coordinate, coordinate width, and coordinate height, in that order. The first pair locates the rectangle; the second pair describes its extent. For 0 0 24 24, the rectangle starts at the origin and extends twenty-four drawing units along each axis.",
  },
  {
    question: "What is preserveAspectRatio?",
    answer:
      "It controls alignment and scaling when the coordinate rectangle and viewport have different proportions. The default, xMidYMid meet, centers the complete drawing with room left over when necessary. A slice setting fills the viewport while preserving proportions, so some artwork may fall outside the visible area and be cropped.",
  },
  {
    question: "Should an icon keep its viewBox?",
    answer:
      "Usually yes, especially if the same icon appears in buttons, menus, and larger layouts. Keeping the coordinate box lets those uses share the same geometry while changing the display dimensions. Verify that the box also includes intended strokes and spacing; retaining an incorrectly sized box will not fix an already cropped icon.",
  },
];

export function SvgViewBoxArticle() {
  return (
    <article className="w-full min-w-0 max-w-4xl space-y-8 break-words text-left text-base leading-7 text-gray-800">
      <p>
        An svg viewbox is the coordinate system of the drawing, not the pixel
        size on the page. It gives the browser a rectangle to map into the space
        available for the image. In actual markup, the attribute is spelled{" "}
        <code>viewBox</code>, with a capital B. Keeping these two kinds of size
        separate makes responsive icons much easier to understand.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">The four numbers</h2>
        <p>
          The pattern is <code>viewBox</code> followed by min-x, min-y, width,
          and height. Its
          four values define a rectangle in user coordinates. The first number
          is the minimum horizontal coordinate, and the second is the minimum
          vertical coordinate. The third and fourth describe the rectangle&apos;s
          width and height. They are extents, not the coordinates of the opposite
          corner.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold">Order</th>
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">1</td>
                <td className="py-2 pr-4">min-x</td>
                <td className="py-2">Left edge of the coordinate rectangle</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">2</td>
                <td className="py-2 pr-4">min-y</td>
                <td className="py-2">Top edge of the coordinate rectangle</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">3</td>
                <td className="py-2 pr-4">width</td>
                <td className="py-2">How wide the rectangle is, not the right-edge coordinate</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">4</td>
                <td className="py-2 pr-4">height</td>
                <td className="py-2">How tall the rectangle is, not the bottom-edge coordinate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Source: the{" "}
          <a href="https://www.w3.org/TR/SVG11/coords.html#ViewBoxAttribute" className="text-blue-700 underline underline-offset-4">viewBox attribute in the W3C SVG specification</a>.
          The default alignment is described under{" "}
          <a href="https://www.w3.org/TR/SVG11/coords.html#PreserveAspectRatioAttribute" className="text-blue-700 underline underline-offset-4">preserveAspectRatio</a>.
        </p>
        <p>
          For example, 0 0 24 24 starts at the origin and covers twenty-four
          units in both directions. A rectangle described as 10 20 24 24 has the
          same size but starts at a different position. Negative starting values
          are possible too. Changing the starting pair changes which coordinate
          region is mapped into the viewport; it does not rewrite the points
          inside each path.
        </p>
        <p>
          These values are not CSS pixels by themselves. They are a measuring
          system for the artwork. A distance of twelve drawing units can occupy
          different screen distances depending on the viewport and scaling
          rules. Reading an svg viewbox as a coordinate rectangle avoids the
          mistaken assumption that every number must match a display dimension.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">Width and height</h2>
        <p>
          The <code>width</code> and <code>height</code> attributes, when present,
          set the viewport dimensions. CSS can also set the displayed size, so
          the final space depends on how the SVG is placed in the page. The{" "}
          <code>viewBox</code> maps the drawing into that viewport without
          requiring every shape to receive new coordinates.
        </p>
        <p>
          Imagine a square drawing whose coordinate box is 24 units across.
          Displaying it in a square viewport 48 CSS pixels across gives each
          drawing unit twice that screen distance. Displaying it at 96 pixels
          increases the scale again. The circle centers and path points remain
          unchanged in the source. Adjusting the viewport and editing the
          geometry are therefore separate operations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          <code>preserveAspectRatio</code>
        </h2>
        <p>
          A square drawing will not naturally match a wide rectangular
          viewport. The <code>preserveAspectRatio</code> attribute determines
          how to handle that mismatch. Its default is xMidYMid meet: the whole
          drawing stays visible and is centered, with empty space if the aspect
          ratios differ. The same scale is used horizontally and vertically,
          keeping circles circular.
        </p>
        <p>
          Using slice instead of meet fills the viewport while keeping the
          proportions, but part of the drawing may extend beyond the viewport
          and be cropped. That can suit a decorative background while hiding
          important parts of an icon. Consider whether showing the complete
          symbol or filling the available rectangle matters more for the
          particular image.
        </p>
        <p>
          SVG Optimize has no switch for <code>preserveAspectRatio</code>. If an
          image has unexpected empty space, inspect its coordinate box, viewport
          dimensions, and alignment setting together. Space can also be built
          into the artwork itself: a small shape inside a large coordinate
          rectangle will retain that surrounding room when scaled.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          Why not to delete it to save bytes
        </h2>
        <p>
          Removing the <code>viewBox</code> can leave the image unable to scale
          as intended, or change how <code>width</code> and <code>height</code>{" "}
          apply to the visible artwork. A larger image box may no longer produce
          a larger drawing. Saving a short attribute is a poor trade when a
          symbol then breaks at another size.
        </p>
        <p>
          In SVG Optimize, Remove viewBox is off by default for that reason.
          SVG Optimize is a free browser tool for people who need a smaller SVG
          without uploading the file. When using{" "}
          <Link href="/" className="text-blue-700 underline underline-offset-4">
            SVG Optimize
          </Link>
          , the file stays in the browser for optimization. Leave that removal
          disabled when the asset needs its coordinate mapping. Use the{" "}
          <Link
            href="/svg-edit"
            className="text-blue-700 underline underline-offset-4"
          >
            SVG Editor
          </Link>{" "}
          for reading the attribute in the markup and checking the rectangle
          against the drawing.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">
          A short coordinate example
        </h2>
        <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm leading-6">
          <code>{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <circle cx="12" cy="12" r="8" />
</svg>`}</code>
        </pre>
        <p>
          This circle sits at the center of a 24 by 24 coordinate rectangle. Its
          radius is eight drawing units, leaving four units between its edge and
          each side of the box. The viewport is 48 by 48, so the circle is drawn
          with a radius of sixteen CSS pixels. Changing both display dimensions
          to 96 doubles that radius again while the svg viewbox stays unchanged.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Frequently asked questions
        </h2>
        {svgViewBoxFaqs.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
