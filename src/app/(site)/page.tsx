import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <div className="home-panel">
        <p className="eyebrow">The Push Authority Engine</p>
        <h1>Scaffold ready</h1>
        <p className="lede">
          Next.js and Payload are wired for the authority system foundation.
        </p>
        <Link className="admin-link" href="/admin">
          Open admin
        </Link>
      </div>
    </main>
  );
}
