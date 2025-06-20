import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Understand how we protect your privacy at SVG-Optimize. We do not collect or store your data. All processing happens in your browser.",
};

export default function Privacy() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: August 20, 2024</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p>
            Welcome to SVG-Optimize! We are committed to protecting your
            privacy. This Privacy Policy explains our principles regarding the
            information we handle. Your trust is important to us, and we are
            dedicated to being transparent about how we operate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            The Core Principle: We Don&apos;t Collect Your Data
          </h2>
          <p>
            Our service is designed with privacy at its core. We do not collect,
            store, log, or share any personal information or data from the files
            you process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            How Your Files Are Processed
          </h2>
          <p>
            <strong>All processing happens locally in your browser.</strong>{" "}
            When you upload an SVG file for optimization, it is not sent to our
            servers. The entire optimization process is performed on your own
            computer using JavaScript that runs in your web browser. Your files
            never leave your device, ensuring complete privacy and control over
            your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Information We Do Not Collect
          </h2>
          <p>To be perfectly clear, we do not collect:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>
              Your name, email address, or any other personal identifiers.
            </li>
            <li>The content of your SVG files or any data within them.</li>
            <li>
              IP addresses or any information about your device or location.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Cookies and Local Storage
          </h2>
          <p>
            SVG-Optimize uses your browser&apos;s local storage to save your
            configuration settings (like your preferred SVGO plugin options).
            This is to enhance your user experience by remembering your choices
            for your next visit. This information is stored only on your
            computer and is not accessible to us. We do not use cookies for
            tracking or analytics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Third-Party Analytics</h2>
          <p>
            We do not use any third-party analytics services like Google
            Analytics. We have no interest in tracking your activity on our
            site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. We
            encourage you to review this policy periodically to stay informed
            about how we are protecting your privacy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please feel
            free to contact us at svgoptimizeoffice@gmail.com (please replace
            with a real contact email if available).
          </p>
        </section>

        <section className="text-center text-sm text-gray-500 py-4 pt-8 gap-4 flex justify-center">
          <Link href="/" className="text-blue-600 hover:text-gray-700">
            Home
          </Link>
          <Link href="/privacy" className="text-blue-600 hover:text-gray-700">
            Privacy Policy
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-gray-500">© 2025 SVG Optimizer</span>
        </section>
      </div>
    </main>
  );
}
