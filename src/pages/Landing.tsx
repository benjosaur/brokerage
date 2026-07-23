import { HeartHandshake, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

const cardStyle =
  "flex flex-col items-center justify-center gap-4 rounded-2xl border border-pk-line bg-white p-8 text-center shadow-[0_12px_30px_rgba(28,39,51,0.05)] transition-colors hover:border-pk-blue/50";

export default function Landing() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 py-12">
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/find-support" className={cardStyle}>
          <HeartHandshake className="text-pk-blue" size={32} aria-hidden />
          <h2 className="font-display text-xl font-bold">
            I’m looking for a micro-provider
          </h2>
        </Link>

        <Link to="/coordinator" className={cardStyle}>
          <ShieldCheck className="text-pk-leaf" size={32} aria-hidden />
          <h2 className="font-display text-xl font-bold">
            I’m a WCN coordinator
          </h2>
        </Link>
      </div>
    </main>
  );
}
