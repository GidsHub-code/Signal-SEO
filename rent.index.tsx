/**
 * RENT INDEX PAGE — /rent
 *
 * Top of the location tree. Lists all Nigerian states
 * and all property types. Catches broad searches like
 * "rent property in Nigeria", "houses for rent Nigeria".
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead, ORG_JSON_LD, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { STATE_SLUGS, TYPE_META } from "./rent.$state.$type";

export const Route = createFileRoute("/rent")({
  head: () =>
    buildHead({
      title: "Rent Property in Nigeria — Houses, Flats, Shops | SignalMe",
      description:
        "Find houses, flats, self-contains, shortlets, shops and offices for rent anywhere in Nigeria. Post a free request — verified agents across all 36 states respond instantly with matching properties.",
      path: "/rent",
      keywords:
        "houses for rent in Nigeria, property for rent Nigeria, flats for rent Nigeria, apartments Nigeria, rent Lagos, rent Abuja, rent Port Harcourt, cheap rentals Nigeria, verified agents Nigeria, SignalMe rent",
      jsonLd: [
        ORG_JSON_LD,
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Rent", path: "/rent" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Properties for Rent in Nigeria by State",
          numberOfItems: Object.keys(STATE_SLUGS).length,
          itemListElement: Object.entries(STATE_SLUGS).map(([slug, name], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Properties for Rent in ${name}`,
            url: `https://signalme.app/rent/${slug}`,
          })),
        },
      ],
    }),

  component: RentIndexPage,
});

// Popular states to feature prominently
const FEATURED_STATES = [
  "lagos", "abuja", "port-harcourt", "ibadan", "kano",
  "enugu", "benin-city", "uyo", "kaduna", "jos",
];

function RentIndexPage() {
  const allStates = Object.entries(STATE_SLUGS);
  const featuredStates = FEATURED_STATES.filter((s) => STATE_SLUGS[s]);
  const otherStates = allStates.filter(([slug]) => !FEATURED_STATES.includes(slug));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="h-9 w-9" />
            <span>SignalMe</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth" search={{ role: "client" } as any}>Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/plans">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          <nav className="text-xs opacity-70 mb-5 flex items-center gap-1">
            <Link to="/" className="hover:opacity-100 underline">Home</Link>
            <span>/</span>
            <span>Rent</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Rent Property in Nigeria
          </h1>
          <p className="mt-3 text-lg opacity-90 max-w-2xl">
            Browse houses, flats, self-contains, shortlets, shops and offices for rent across all 36 states. Post a free request — verified agents come to you instantly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold">
              <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
                Post a free request <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm opacity-85">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 100% free for renters</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Verified agents only</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> All 36 states + FCT covered</span>
          </div>
        </div>
      </section>

      {/* Browse by property type */}
      <section className="max-w-6xl mx-auto px-5 py-14 w-full">
        <h2 className="text-2xl font-bold mb-2">Browse by property type</h2>
        <p className="text-muted-foreground mb-8">Select the type of property you need, then choose your state.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(TYPE_META).map(([slug, meta]) => {
            const Icon = meta.icon;
            return (
              <Link
                key={slug}
                to="/rent/$state/$type"
                params={{ state: "lagos", type: slug }}
                className="group rounded-xl border bg-card p-4 text-center hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold group-hover:text-primary transition-colors">{meta.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{meta.priceRange}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured states */}
      <section className="bg-secondary/40 border-y">
        <div className="max-w-6xl mx-auto px-5 py-14 w-full">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Popular states
          </h2>
          <p className="text-muted-foreground mb-8">
            The most searched rental locations in Nigeria.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredStates.map((slug) => {
              const name = STATE_SLUGS[slug];
              return (
                <Link
                  key={slug}
                  to="/rent/$state"
                  params={{ state: slug }}
                  className="group rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="font-semibold group-hover:text-primary transition-colors">{name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Object.keys(TYPE_META).length} property types
                  </div>
                  <div className="text-xs text-primary mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse properties <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All states */}
      <section className="max-w-6xl mx-auto px-5 py-12 w-full">
        <h2 className="text-xl font-bold mb-5">All states in Nigeria</h2>
        <div className="flex flex-wrap gap-3">
          {allStates.map(([slug, name]) => (
            <Link
              key={slug}
              to="/rent/$state"
              params={{ state: slug }}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 border-y">
        <div className="max-w-6xl mx-auto px-5 py-14 w-full">
          <h2 className="text-2xl font-bold text-center mb-10">How SignalMe works for renters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Post your request", body: "Tell us what you need — property type, state, area, budget. Free and takes 2 minutes." },
              { n: "02", title: "Agents are signalled", body: "Verified agents in your chosen state and area get an instant notification and respond with matching properties." },
              { n: "03", title: "Inspect then pay", body: "Chat with agents, ask questions, physically inspect the property. Only pay after you're satisfied." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="text-5xl font-extrabold text-primary/20">{s.n}</div>
                <h3 className="font-semibold text-lg mt-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Find your next home or workspace in Nigeria</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Post a free request and let verified Nigerian agents bring the right property to you.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 mt-7 shadow-xl font-semibold">
            <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
              Get started — it's free <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto w-full px-5 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>© SignalMe</span>
        </div>
        <nav className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
