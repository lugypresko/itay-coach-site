import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The Push",
  description: "Privacy Policy for The Push and Itay Foyerstein. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="content-shell" id="privacy-policy">
      <article className="content-panel content-panel-wide">
        <h1>Privacy Policy</h1>
        <p className="lede">Last Updated: June 2026</p>

        <section>
          <h2>Introduction</h2>
          <p>
            The Push and Itay Foyerstein (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respect your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and protect information submitted through our website, assessments, forms, and marketing campaigns.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When you submit information through our website, assessments, or advertising campaigns, we may collect:
          </p>
          <ul className="content-list">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>LinkedIn profile URL (if provided)</li>
            <li>Professional role and company information</li>
            <li>Assessment responses and survey answers</li>
            <li>Information you voluntarily provide during conversations or consultations</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>
            We use the information collected to:
          </p>
          <ul className="content-list">
            <li>Deliver assessment results</li>
            <li>Provide professional recommendations and insights</li>
            <li>Contact you regarding your inquiry</li>
            <li>Schedule consultations or diagnostic sessions</li>
            <li>Improve our services, content, and customer experience</li>
            <li>Send relevant professional updates or resources</li>
          </ul>
        </section>

        <section>
          <h2>Information Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information.
            We may share information with trusted service providers that help us operate our website, CRM, analytics, email communications, or advertising platforms, provided they agree to maintain appropriate confidentiality and security standards.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect personal information against unauthorized access, disclosure, alteration, or destruction.
            However, no method of transmission over the internet can be guaranteed to be completely secure.
          </p>
        </section>

        <section>
          <h2>Marketing Communications</h2>
          <p>
            You may receive professional communications related to your assessment, inquiry, or areas of interest.
            You may opt out of receiving future communications at any time.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            You may request to:
          </p>
          <ul className="content-list">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Withdraw consent for future communications</li>
          </ul>
          <p>
            To submit a request, please contact us using the details below.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            Our website and marketing activities may use third-party services including analytics, advertising, scheduling, email delivery, and customer relationship management platforms.
            These services may collect information in accordance with their own privacy policies.
          </p>
        </section>

        <section>
          <h2>Cookies and Analytics</h2>
          <p>
            Our website may use cookies and similar technologies to improve user experience, analyze website traffic, and measure the effectiveness of marketing campaigns.
            These technologies may collect information such as:
          </p>
          <ul className="content-list">
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited</li>
            <li>Referral sources</li>
            <li>Time spent on pages</li>
            <li>Advertising interactions</li>
          </ul>
          <p>
            You can modify your browser settings to manage or disable cookies at any time.
          </p>
        </section>

        <section>
          <h2>Advertising and Remarketing</h2>
          <p>
            We may use advertising platforms, including Meta (Facebook and Instagram), Google, LinkedIn, and other advertising networks to:
          </p>
          <ul className="content-list">
            <li>Measure campaign performance</li>
            <li>Understand audience engagement</li>
            <li>Deliver relevant advertising</li>
            <li>Create remarketing audiences</li>
          </ul>
          <p>
            These platforms may use cookies, pixels, or similar technologies to help us understand how visitors interact with our website and marketing campaigns.
          </p>
        </section>

        <section>
          <h2>International Data Processing</h2>
          <p>
            Information may be processed or stored by service providers located in different countries.
            By submitting your information, you acknowledge that your information may be transferred and processed outside your country of residence, subject to applicable privacy and security standards.
          </p>
        </section>

        <section>
          <h2>Professional Disclaimer</h2>
          <p>
            Assessments, diagnostics, coaching conversations, and educational content provided through this website are intended for informational and professional development purposes only.
            No assessment, recommendation, diagnosis, coaching session, or educational content constitutes legal, financial, employment, tax, or professional advice.
            Any decisions made based on information provided through this website remain solely the responsibility of the individual or organization receiving such information.
          </p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            We retain personal information only for as long as reasonably necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            Information that is no longer required will be securely deleted or anonymized.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time.
            Any updates will be published on this page together with the revised effective date.
            Continued use of our website, assessments, or services after changes are published constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact:
          </p>
          <p>
            <strong>Itay Foyerstein</strong><br />
            Email: <a href="mailto:contact@itayfoyerstein.com">contact@itayfoyerstein.com</a><br />
            Website: <a href="https://itayfoyerstein.com">https://itayfoyerstein.com</a>
          </p>
        </section>

        <p style={{ marginTop: "var(--space-8)", fontStyle: "italic" }}>
          By submitting information through our website, assessments, forms, or advertising campaigns, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </article>
    </main>
  );
}
