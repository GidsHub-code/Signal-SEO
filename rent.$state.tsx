/**
 * STATE HUB PAGE — /rent/$state
 *
 * e.g. /rent/lagos  →  "Properties for Rent in Lagos"
 *
 * Lists all 10 property types with links to the deeper
 * /rent/$state/$type pages — adds another layer of
 * internal linking and catches "property for rent in Lagos"
 * style searches.
 */

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { STATE_SLUGS, TYPE_META } from "./rent.$state.$type";

const ALL_STATE_SLUGS = Object.keys(STATE_SLUGS);

export const Route = createFileRoute("/rent/$state")({
  head: ({ params }) => {
    const stateName = STATE_SLUGS[params.state];
    if (!stateName) return { meta: [], links: [], scripts: [] };

    return buildHead({
      title: `Properties for Rent in ${stateName} | SignalMe Nigeria`,
      description: `Find houses, flats, self-contains, shops and offices for rent in ${stateName}. Post a free request — verified ${stateName} agents respond instantly with matching properties.`,
      path: `/rent/${params.state}`,
      keywords: `properties for rent in ${stateName}, houses for rent ${stateName}, apartments ${stateName}, flats for rent ${stateName}, ${stateName} rental, real estate ${stateName} Nigeria`,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Rent", path: `/rent/${params.state}` },
          { name: stateName, path: `/rent/${params.state}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Property Types for Rent in ${stateName}`,
          description: `Browse all property types available for rent in ${stateName}, Nigeria`,
          numberOfItems: Object.keys(TYPE_META).length,
          itemListElement: Object.entries(TYPE_META).map(([slug, meta], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${meta.plural} for Rent in ${stateName}`,
            url: `https://signalme.app/rent/${params.state}/${slug}`,
          })),
        },
      ],
    });
  },

  loader: ({ params }) => {
    if (!STATE_SLUGS[params.state]) throw notFound();
    return {
      stateName: STATE_SLUGS[params.state],
      stateSlug: params.state,
    };
  },

  component: StateHubPage,
});

function StateHubPage() {
  const { stateName, stateSlug } = Route.useLoaderData();
  const otherStates = ALL_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 16);

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
            <span>/</span>
            <span>{stateName}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Properties for Rent in {stateName}
          </h1>
          <p className="mt-3 text-lg opacity-90 max-w-2xl">
            Looking for a house, flat, shop or office to rent in {stateName}? Post a free request and verified {stateName} agents respond instantly with matching properties — no agents to chase.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold">
              <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
                Post a free request <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm opacity-85">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Free for renters</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Verified agents only</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Instant match</span>
          </div>
        </div>
      </section>

      {/* Property types grid */}
      <section className="max-w-6xl mx-auto px-5 py-14 w-full">
        <h2 className="text-2xl font-bold mb-2">Browse by property type in {stateName}</h2>
        <p className="text-muted-foreground mb-8">
          Select the type of property you're looking for in {stateName}. Each page has verified agents ready to respond.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(TYPE_META).map(([slug, meta]) => {
            const Icon = meta.icon;
            return (
              <Link
                key={slug}
                to="/rent/$state/$type"
                params={{ state: stateSlug, type: slug }}
                className="group rounded-2xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold group-hover:text-primary transition-colors">
                      {meta.label} in {stateName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{meta.priceRange}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Other states */}
      <section className="bg-secondary/40 border-y">
        <div className="max-w-6xl mx-auto px-5 py-12 w-full">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Other Nigerian states
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherStates.map((s) => (
              <Link
                key={s}
                to="/rent/$state"
                params={{ state: s }}
                className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                {STATE_SLUGS[s]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to find property in {stateName}?</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Post your free request in 2 minutes. Verified {stateName} agents respond instantly.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 mt-7 shadow-xl font-semibold">
            <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
              Get started free <ArrowRight className="h-4 w-4 ml-1" />
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
