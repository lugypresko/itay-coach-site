import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeV3Selector } from "@/components/home-v3-selector";
import { HomeV3TrackedLink } from "@/components/home-v3-tracked-link";

export const metadata: Metadata = {
  title: "The Push: technical leadership coaching",
  description:
    "1:1 coaching for Engineering Managers, Group Managers and Directors in growing B2B SaaS companies. Start with one real situation and get a written first read before anyone asks for a call.",
  alternates: { canonical: "https://itayfoyerstein.com/" },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://itayfoyerstein.com/",
  name: metadata.title,
  description: metadata.description,
};

export default function HomePage() {
  return (
    <div className="approved-home" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="home-header">
        <div className="w nav">
          <Link className="brand" href="#top">The Push</Link>
          <nav aria-label="Homepage">
            <Link href="#proof">Proof</Link>
            <Link href="#how">How it works</Link>
            <Link href="#fit">Fit</Link>
            <Link className="btn sm" href="#start">Start with one case</Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="w hg">
            <div>
              <h1>Your team can do the work. The decisions still come back to you.</h1>
              <p className="pay"><strong>The goal isn&apos;t to be needed less. It&apos;s to be needed at the right level.</strong></p>
              <p className="who">1:1 coaching for Engineering Managers, Group Managers and Directors in growing B2B SaaS companies.</p>
              <div className="act">
                <Link className="btn" href="#start">Bring one current case</Link>
                <span className="fine">You get a written first read before anyone asks for a call.</span>
              </div>
            </div>
            <aside className="read" aria-label="Example first read">
              <div className="tg">What you get back: an example</div>
              <h3>There is a pattern worth looking at.</h3>
              <p>You described this as a capability or confidence issue.</p>
              <dl>
                <dt>Working pattern</dt><dd>Decision dependency.</dd>
                <dt>Strongest signal</dt><dd>When you are unavailable, the work slows rather than stops.</dd>
                <dt>Next</dt><dd>One distinction to test before treating this as a capability problem.</dd>
              </dl>
            </aside>
          </div>
        </section>

        <div className="creds">
          <div className="w">
            <span className="l">25+ years in technology and delivery. 1000+ coaching hours. Worked with people at</span>
            <span>ServiceNow</span><span>Amdocs</span><span>Taboola</span><span>Claroty</span><span>EY</span><span>888</span>
          </div>
        </div>

        <section>
          <div className="w">
            <div className="hd">
              <h2>Where does it show up for you?</h2>
              <p>The useful question isn&apos;t whether to delegate more. It&apos;s what genuinely needs your judgment, and what has simply learned to wait for it.</p>
            </div>
            <div className="scenes">
              <article className="sc"><h3>The meeting you have to attend.</h3><p>Accountability quietly turned into being present.</p></article>
              <article className="sc"><h3>The decision that comes back for one last check.</h3><p>The team can do the work. Judgment still lives one level higher.</p></article>
              <article className="sc"><h3>The strategic work that starts after the meetings end.</h3><p>Delivery is moving. Your calendar is full.</p></article>
            </div>
            <blockquote className="quote">
              “Itay helped me fine-tune my leadership approach and scale my impact as an R&amp;D Director.”
              <small>Ziv Baruch, R&amp;D Director</small>
            </blockquote>
          </div>
        </section>

        <section className="pattern-section">
          <div className="w"><HomeV3Selector /></div>
        </section>

        <section className="proof" id="proof">
          <div className="w">
            <div className="hd">
              <h2>Not testimonials. What changed in the work.</h2>
              <p>Proof here says what someone started doing differently and what others could then observe.</p>
            </div>
            <div className="cases">
              <article className="case">
                <div className="id">Claudia, Sales Director Mittelstand &amp; Enterprise, ServiceNow</div>
                <h3>From hitting $10M to designing for $20M</h3>
                <p>We first built the operating approach for the first $10M: team structure, principles, SOPs. Then the question changed: if the system supports $10M, what must change to support $20M?</p>
                <div className="ev"><b>Shift:</b> from hitting a target to designing the operating system for the next level.</div>
              </article>
              <article className="case">
                <div className="id">Technology leader, name withheld</div>
                <h3>From contributor to owner</h3>
                <p>He wanted to be recognized as a technology leader. We moved him from doing his part to defining direction, creating alignment and owning the outcome.</p>
                <div className="ev"><b>Observable:</b> he now leads a high-priority taskforce, presents in management forums, and senior technologists come to him for his judgment.</div>
              </article>
              <article className="case">
                <div className="id">Senior R&amp;D leader, name withheld</div>
                <h3>From managed by the calendar to managing the system</h3>
                <p>We examined which meetings needed a decision, what he needed to ask for, and where his presence added nothing.</p>
                <div className="ev"><b>Observable:</b> fewer unnecessary meetings, sharper questions, more control over his attention.</div>
              </article>
            </div>
            <p className="note">Names are withheld where confidentiality requires it. Funding by a company never authorizes sharing what is said in sessions.</p>
            <div className="proof-action"><Link className="btn" href="#start">Try it on my case</Link></div>
          </div>
        </section>

        <section id="how">
          <div className="w">
            <div className="hd">
              <h2>Don&apos;t call it a bottleneck before the evidence earns the diagnosis.</h2>
              <p>One incident is a story. A repeated pattern, competing explanations and a reversible test give us something to work with.</p>
            </div>
            <div className="steps">
              <div className="st"><b>See</b><span>the real case and the system around it</span></div>
              <div className="st"><b>Challenge</b><span>the first explanation</span></div>
              <div className="st"><b>Move</b><span>one real leadership behavior</span></div>
              <div className="st"><b>Read</b><span>how people respond</span></div>
              <div className="st"><b>Adjust</b><span>what comes next</span></div>
            </div>
            <div className="facts">
              <div><strong>12</strong>weeks</div>
              <div><strong>6</strong>private 1:1 sessions</div>
              <div><strong>1</strong>problem worth changing</div>
            </div>
          </div>
        </section>

        <section className="fit-section" id="fit">
          <div className="w">
            <div className="hd"><h2>Who this is for, and who it isn&apos;t.</h2></div>
            <div className="fit">
              <article className="fb y"><h3>Strong fit</h3><ul>
                <li>Your scope has grown, but too much still depends on your direct involvement.</li>
                <li>You lead capable people and want more leverage without becoming disconnected.</li>
                <li>You are willing to test changes between sessions.</li>
              </ul></article>
              <article className="fb"><h3>Probably not a coaching problem</h3><ul>
                <li>You don&apos;t have the authority the role requires.</li>
                <li>The team is materially understaffed.</li>
                <li>The role or organization design is unresolved.</li>
              </ul></article>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="w about">
            <div className="ph">
              <Image src="/itay-home-photo.jpg" alt="Itay Foyerstein in his workspace" fill sizes="(max-width: 860px) 260px, 35vw" />
            </div>
            <div>
              <h2>I spent most of my career inside the problems I now coach.</h2>
              <p className="about-intro">For 25+ years I have worked across technology, product, delivery and organizational change, from hands-on execution to cross-functional programs, consulting and leadership.</p>
              <p>The coaching is practical because the work is: real people, real trade-offs, real accountability, and decisions that still have to ship.</p>
              <Link className="btn sm dark" href="/about">More about my background</Link>
            </div>
          </div>
        </section>

        <section className="final" id="start">
          <div className="w">
            <h2>Start with one real situation.</h2>
            <p className="final-copy">Bring one current decision, review, escalation or meeting that keeps coming back to you. You get a working read before deciding whether a conversation makes sense.</p>
            <div className="flow" aria-label="Diagnostic steps"><span>Case</span><span>Context</span><span>Hypothesis</span><span>Experiment</span></div>
            <HomeV3TrackedLink className="btn final-link">Start with my case</HomeV3TrackedLink>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="w">The Push. Itay Foyerstein.</div>
      </footer>
    </div>
  );
}
