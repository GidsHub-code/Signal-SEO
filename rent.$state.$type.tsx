/**
 * PROGRAMMATIC SEO — Location + Property Type Landing Pages
 *
 * Generates one page per state/type combo:
 *   /rent/lagos/2-bedroom-flat
 *   /rent/abuja/shop
 *   /rent/port-harcourt/selfcon
 *   … (37 states × 10 types = 370 indexed pages)
 *
 * Each page:
 *  - Has its own unique <title>, <meta description>, <h1>
 *  - Carries FAQ + BreadcrumbList + LocalBusiness JSON-LD
 *  - Includes a "Post a request" CTA that routes into the real app
 *  - Links to all other property types in the same state (internal linking)
 */

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildHead, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin, Home, ShoppingBag, Building2, Warehouse } from "lucide-react";
import { Logo } from "@/components/Logo";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

export const STATE_SLUGS: Record<string, string> = {
  "lagos": "Lagos",
  "abuja": "FCT - Abuja",
  "port-harcourt": "Rivers",
  "ibadan": "Oyo",
  "kano": "Kano",
  "enugu": "Enugu",
  "benin-city": "Edo",
  "uyo": "Akwa Ibom",
  "kaduna": "Kaduna",
  "jos": "Plateau",
  "abia": "Abia",
  "adamawa": "Adamawa",
  "akwa-ibom": "Akwa Ibom",
  "anambra": "Anambra",
  "bauchi": "Bauchi",
  "bayelsa": "Bayelsa",
  "benue": "Benue",
  "borno": "Borno",
  "cross-river": "Cross River",
  "delta": "Delta",
  "ebonyi": "Ebonyi",
  "edo": "Edo",
  "ekiti": "Ekiti",
  "gombe": "Gombe",
  "imo": "Imo",
  "jigawa": "Jigawa",
  "katsina": "Katsina",
  "kebbi": "Kebbi",
  "kogi": "Kogi",
  "kwara": "Kwara",
  "nasarawa": "Nasarawa",
  "niger": "Niger",
  "ogun": "Ogun",
  "ondo": "Ondo",
  "osun": "Osun",
  "sokoto": "Sokoto",
  "taraba": "Taraba",
  "yobe": "Yobe",
  "zamfara": "Zamfara",
};

// Display names for all states (used in nav)
const ALL_STATE_SLUGS = Object.keys(STATE_SLUGS);

export const TYPE_META: Record<
  string,
  { label: string; plural: string; icon: typeof Home; priceRange: string; description: string }
> = {
  "selfcon": {
    label: "1 Room Self-Contain",
    plural: "Self-Contain Apartments",
    icon: Home,
    priceRange: "₦150,000 – ₦600,000/yr",
    description: "A single room with private bathroom and kitchenette. Popular with young professionals and students.",
  },
  "1-room": {
    label: "1 Room",
    plural: "1-Room Apartments",
    icon: Home,
    priceRange: "₦80,000 – ₦350,000/yr",
    description: "A basic single room, often with shared bathroom. The most affordable rental option in Nigeria.",
  },
  "room-and-parlour": {
    label: "Room and Parlour",
    plural: "Room & Parlour Flats",
    icon: Home,
    priceRange: "₦200,000 – ₦800,000/yr",
    description: "A bedroom plus a sitting room. Ideal for small families and couples looking for more space.",
  },
  "2-bedroom-flat": {
    label: "2-Bedroom Flat",
    plural: "2-Bedroom Flats",
    icon: Home,
    priceRange: "₦400,000 – ₦2,500,000/yr",
    description: "Two bedrooms, a sitting room, kitchen, and bathroom. One of the most popular property types in Nigeria.",
  },
  "3-bedroom-flat": {
    label: "3-Bedroom Flat",
    plural: "3-Bedroom Flats",
    icon: Home,
    priceRange: "₦700,000 – ₦5,000,000/yr",
    description: "Three bedrooms with full facilities. Suitable for larger families or shared living arrangements.",
  },
  "duplex": {
    label: "Duplex",
    plural: "Duplexes",
    icon: Building2,
    priceRange: "₦1,500,000 – ₦10,000,000/yr",
    description: "A two-storey house with multiple bedrooms. A premium residential option in Nigerian cities.",
  },
  "shop": {
    label: "Shop",
    plural: "Shops",
    icon: ShoppingBag,
    priceRange: "₦200,000 – ₦3,000,000/yr",
    description: "Commercial retail space for business. Available in markets, plazas, and standalone units.",
  },
  "office": {
    label: "Office Space",
    plural: "Office Spaces",
    icon: Building2,
    priceRange: "₦500,000 – ₦8,000,000/yr",
    description: "Professional office space for businesses, startups and corporate tenants across Nigeria.",
  },
  "warehouse": {
    label: "Warehouse",
    plural: "Warehouses",
    icon: Warehouse,
    priceRange: "₦1,000,000 – ₦15,000,000/yr",
    description: "Storage and industrial warehousing space. Suitable for logistics, manufacturing and goods storage.",
  },
  "hall": {
    label: "Hall",
    plural: "Event Halls",
    icon: Building2,
    priceRange: "₦200,000 – ₦5,000,000/yr",
    description: "Event and function halls for ceremonies, meetings and gatherings across Nigeria.",
  },
};

const ALL_TYPE_SLUGS = Object.keys(TYPE_META);

// Popular areas per state for content richness
const STATE_AREAS: Record<string, string[]> = {
  "lagos": ["Lekki", "Yaba", "Ikeja", "Surulere", "Victoria Island", "Ajah", "Ikoyi", "Gbagada", "Magodo", "Maryland"],
  "abuja": ["Gwarinpa", "Garki", "Maitama", "Wuse", "Kubwa", "Asokoro", "Jabi", "Kado", "Durumi", "Lifecamp"],
  "port-harcourt": ["GRA", "Rumuola", "Woji", "Eleme", "Rumuokoro", "Diobu", "Oyigbo", "Rumuosi"],
  "ibadan": ["Bodija", "Challenge", "Dugbe", "Mokola", "Agodi", "Sango", "Ring Road", "Iwo Road"],
  "enugu": ["GRA", "Independence Layout", "New Haven", "Abakpa", "Emene", "Achara Layout"],
  "benin-city": ["GRA", "Ugbor", "Ikpoba", "Oredo", "Egor", "Oka"],
};

function getAreas(stateSlug: string): string[] {
  return STATE_AREAS[stateSlug] ?? ["city centre", "GRA", "estate areas"];
}

// ─────────────────────────────────────────────
// ROUTE
// ─────────────────────────────────────────────

export const Route = createFileRoute("/rent/$state/$type")({
  head: ({ params }) => {
    const stateName = STATE_SLUGS[params.state];
    const typeMeta = TYPE_META[params.type];
    if (!stateName || !typeMeta) return { meta: [], links: [], scripts: [] };

    const title = `${typeMeta.plural} for Rent in ${stateName} | SignalMe Nigeria`;
    const description = `Find verified ${typeMeta.label.toLowerCase()} for rent in ${stateName}. Post your request free — verified Nigerian agents respond instantly with matching properties. ${typeMeta.priceRange}.`;
    const path = `/rent/${params.state}/${params.type}`;
    const keywords = `${typeMeta.label.toLowerCase()} for rent in ${stateName}, ${typeMeta.plural.toLowerCase()} ${stateName}, rent ${typeMeta.label.toLowerCase()} ${stateName} Nigeria, ${stateName} ${typeMeta.label.toLowerCase()} rental, cheap ${typeMeta.label.toLowerCase()} ${stateName}, affordable ${typeMeta.label.toLowerCase()} ${stateName}`;

    const areas = getAreas(params.state);

    return buildHead({
      title,
      description,
      path,
      keywords,
      jsonLd: [
        faqJsonLd([
          {
            q: `How do I find a ${typeMeta.label.toLowerCase()} for rent in ${stateName}?`,
            a: `On SignalMe, you post a free request describing the ${typeMeta.label.toLowerCase()} you want, including your preferred area in ${stateName} and your budget. Verified agents in ${stateName} instantly see your request and message you with matching properties.`,
          },
          {
            q: `How much does a ${typeMeta.label.toLowerCase()} cost to rent in ${stateName}?`,
            a: `Rental prices for a ${typeMeta.label.toLowerCase()} in ${stateName} typically range from ${typeMeta.priceRange} depending on the specific area, facilities, and condition. Popular areas like ${areas.slice(0, 3).join(", ")} tend to be pricier than outer neighbourhoods.`,
          },
          {
            q: `Are there agency fees for renting in ${stateName}?`,
            a: `Yes. In ${stateName}, agents typically charge 10% of the annual rent as agency fee, plus a caution deposit (usually 1 month's rent) and sometimes a legal fee. On SignalMe, these terms are discussed directly with agents — there are no hidden platform charges.`,
          },
          {
            q: `How long does it take to find a ${typeMeta.label.toLowerCase()} in ${stateName}?`,
            a: `With SignalMe, verified agents in ${stateName} respond to your rental request typically within hours. You can inspect a property and finalise within 1-3 days, much faster than traditional property searching.`,
          },
          {
            q: `Is it safe to search for property to rent in ${stateName}?`,
            a: `SignalMe only connects you with verified agents. Always physically inspect any property before making any payment. Never pay caution deposit or agency fee without seeing the property in person.`,
          },
        ]),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Rent", path: `/rent/${params.state}/${params.type}` },
          { name: stateName, path: `/rent/${params.state}/${params.type}` },
          { name: typeMeta.label, path: `/rent/${params.state}/${params.type}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `https://signalme.com.ng/rent/${params.state}/${params.type}`,
          name: `SignalMe ${stateName}`,
          description: `Nigeria's demand-first rental platform for ${typeMeta.plural.toLowerCase()} in ${stateName}. Post your request, verified agents respond.`,
          url: `https://signalme.com.ng/rent/${params.state}/${params.type}`,
          logo: "https://signalme.com.ng/icon-512.png",
          areaServed: {
            "@type": "State",
            name: stateName,
            containedInPlace: { "@type": "Country", name: "Nigeria" },
          },
          serviceType: `${typeMeta.label} Rental`,
        },
      ],
    });
  },

  loader: ({ params }) => {
    if (!STATE_SLUGS[params.state] || !TYPE_META[params.type]) {
      throw notFound();
    }
    return {
      stateName: STATE_SLUGS[params.state],
      stateSlug: params.state,
      typeSlug: params.type,
      typeMeta: TYPE_META[params.type],
      areas: getAreas(params.state),
    };
  },

  component: LocationTypePage,
});

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

function LocationTypePage() {
  const { stateName, stateSlug, typeSlug, typeMeta, areas } = Route.useLoaderData();
  const TypeIcon = typeMeta.icon;

  // Other property types in same state (internal linking)
  const otherTypes = ALL_TYPE_SLUGS.filter((t) => t !== typeSlug);

  // Other states for this property type (internal linking)
  const otherStates = ALL_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Nav ── */}
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

      {/* ── Hero ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="text-xs opacity-70 mb-5 flex items-center gap-1 flex-wrap">
            <Link to="/" className="hover:opacity-100 underline">Home</Link>
            <span>/</span>
            <span>Rent</span>
            <span>/</span>
            <span>{stateName}</span>
            <span>/</span>
            <span>{typeMeta.label}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {typeMeta.plural} for Rent in {stateName}
              </h1>
              <p className="mt-3 text-lg opacity-90 max-w-2xl">
                {typeMeta.description} Post a free request — verified agents in {stateName} respond instantly with matching options.
              </p>
              <p className="mt-2 text-sm opacity-75">
                Typical rent: <strong>{typeMeta.priceRange}</strong> · Covers {areas.slice(0, 4).join(", ")} and more
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold"
            >
              <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
                Post a free request <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/40 text-white hover:bg-white/10"
            >
              <Link to="/plans">I'm an agent</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm opacity-85">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Free for renters</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Verified agents only</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Instant match</span>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-5 py-16 w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          How to find a {typeMeta.label.toLowerCase()} in {stateName}
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          SignalMe flips the traditional rental process. Instead of you chasing agents, they come to you.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              title: "Post your request",
              body: `Tell us you need a ${typeMeta.label.toLowerCase()} in ${stateName} — area, budget, move-in date. Takes 2 minutes and it's free.`,
            },
            {
              n: "02",
              title: "Agents are signalled",
              body: `Verified ${stateName} agents who cover that area and property type get an instant notification and message you with matching options.`,
            },
            {
              n: "03",
              title: "Inspect before you pay",
              body: `Chat, ask questions, and physically see the ${typeMeta.label.toLowerCase()} before making any payment. No upfront costs on SignalMe.`,
            },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="text-5xl font-extrabold text-primary/20">{step.n}</div>
              <h3 className="font-semibold text-lg mt-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular areas ── */}
      <section className="bg-secondary/40 border-y">
        <div className="max-w-6xl mx-auto px-5 py-14 w-full">
          <h2 className="text-2xl font-bold mb-2">
            Popular areas for {typeMeta.plural.toLowerCase()} in {stateName}
          </h2>
          <p className="text-muted-foreground mb-8">
            Verified agents on SignalMe cover all major neighbourhoods across {stateName}.
          </p>
          <div className="flex flex-wrap gap-3">
            {areas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {area}, {stateName}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Don't see your area? Post a request and specify any neighbourhood in {stateName} — agents who cover it will respond.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-5 py-16 w-full">
        <h2 className="text-2xl font-bold mb-8">
          FAQs — Renting a {typeMeta.label} in {stateName}
        </h2>
        <div className="space-y-5 max-w-3xl">
          {[
            {
              q: `How much does a ${typeMeta.label.toLowerCase()} cost to rent in ${stateName}?`,
              a: `Rental prices in ${stateName} for a ${typeMeta.label.toLowerCase()} typically range from ${typeMeta.priceRange} per year. Pricing varies by area — premium estates like ${areas[0] || "GRA"} command higher rents, while outer areas are more affordable.`,
            },
            {
              q: `What fees do I need to pay when renting in ${stateName}?`,
              a: `Expect to pay agency fee (usually 10% of annual rent), caution deposit (1 month's rent), and sometimes a legal/agreement fee. Always agree on fees upfront and never pay without seeing the property.`,
            },
            {
              q: `How do I avoid rental scams in ${stateName}?`,
              a: `Only work with verified agents. Never pay money for a property you haven't physically inspected. Avoid anyone who asks for payment via online transfer before a viewing. SignalMe only connects you with verified agents.`,
            },
            {
              q: `Can I pay rent monthly in ${stateName}?`,
              a: `Most Nigerian landlords request rent annually or bi-annually upfront. However, some landlords — especially for commercial properties — accept monthly or quarterly payments. You can negotiate payment terms with the agent directly on SignalMe.`,
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Other types in this state (internal links) ── */}
      <section className="bg-secondary/40 border-y">
        <div className="max-w-6xl mx-auto px-5 py-12 w-full">
          <h2 className="text-xl font-bold mb-5">
            Other properties for rent in {stateName}
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherTypes.map((t) => (
              <Link
                key={t}
                to="/rent/$state/$type"
                params={{ state: stateSlug, type: t }}
                className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                {TYPE_META[t].label} in {stateName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other states for this type (internal links) ── */}
      <section className="max-w-6xl mx-auto px-5 py-12 w-full">
        <h2 className="text-xl font-bold mb-5">
          {typeMeta.plural} for rent in other Nigerian states
        </h2>
        <div className="flex flex-wrap gap-3">
          {otherStates.map((s) => (
            <Link
              key={s}
              to="/rent/$state/$type"
              params={{ state: s, type: typeSlug }}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              {STATE_SLUGS[s]}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to find your {typeMeta.label.toLowerCase()} in {stateName}?
          </h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Post a free request in 2 minutes. Verified agents in {stateName} respond with matching properties — no endless phone calls, no scams.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 mt-7 shadow-xl font-semibold"
          >
            <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
              Post a free request <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto w-full px-5 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>© 2025-2026 SignalMe</span>
        </div>
        <nav className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
