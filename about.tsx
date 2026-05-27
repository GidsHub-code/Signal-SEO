import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead, ORG_JSON_LD, breadcrumbJsonLd } from "@/lib/seo";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () =>
    buildHead({
      title: "About SignalMe — Nigeria's Demand-First Real Estate Platform",
      description:
        "SignalMe is Nigeria's demand-first rental platform built by Gidsworld Ventures. Renters post what they want — verified real estate agents in Lagos, Abuja, Port Harcourt and across all 36 states respond instantly with matching apartments, flats, shortlets, shops and offices.",
      path: "/about",
      keywords:
        "about SignalMe, Nigerian real estate platform, rent house Nigeria, find verified agent Lagos, Abuja property platform, alternative to Jiji houses, alternative to PropertyPro, property rental marketplace Nigeria, Gidsworld Ventures, demand-first rental Nigeria",
      jsonLd: [
        ORG_JSON_LD,
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About SignalMe",
          url: "https://signalme.app/about",
          mainEntity: {
            "@type": "Organization",
            name: "SignalMe",
            legalName: "Gidsworld Ventures",
            foundingDate: "2025",
            foundingLocation: { "@type": "Country", name: "Nigeria" },
            url: "https://signalme.app",
            description:
              "Nigeria's demand-first real estate platform. Renters post what they need, verified agents respond instantly with matching properties across all 36 states.",
          },
        },
      ],
    }),
  component: About,
});

function About() {
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
              <Link to="/plans">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-5 py-16">
            <nav className="text-xs opacity-70 mb-5 flex items-center gap-1">
              <Link to="/" className="hover:opacity-100 underline">Home</Link>
              <span>/</span>
              <span>About</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              About SignalMe
            </h1>
            <p className="mt-4 text-lg opacity-90 max-w-2xl leading-relaxed">
              Nigeria's demand-first rental platform — where renters post what they want and verified agents come to them.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-4xl mx-auto px-5 py-14">
          <h2 className="text-2xl font-bold mb-4">Why SignalMe exists</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Finding a house to rent in Nigeria has always been a frustrating, time-consuming, and often dangerous process. Prospective tenants spend days — sometimes weeks — calling agent after agent, visiting properties that don't match the description, and still risk losing their money to scammers. The traditional model is broken: the burden falls entirely on the renter, while unverified agents hold all the power.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground mt-4">
            SignalMe was built to flip this. Instead of renters chasing agents, we created a platform where renters post exactly what they want — property type, location, budget — and verified agents who cover that area receive an instant notification (a "Signal") and respond with matching options. The renter stays in control. The agent comes to them.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground mt-4">
            We call this the <strong className="text-foreground">demand-first</strong> model, and it is changing how Nigerians rent property across Lagos, Abuja, Port Harcourt, Ibadan, Enugu, and every other state in the country.
          </p>
        </section>

        {/* Values */}
        <section className="bg-secondary/40 border-y">
          <div className="max-w-4xl mx-auto px-5 py-14">
            <h2 className="text-2xl font-bold mb-8">What we stand for</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Safety first",
                  body: "Every agent on SignalMe is verified before they can respond to requests. We also remind every renter: never pay for a property without physically inspecting it. Scams thrive in the dark — we shine a light.",
                },
                {
                  icon: Zap,
                  title: "Speed matters",
                  body: "In Nigeria's rental market, good properties go fast. Our Signal Matrix routes requests to matching agents in seconds, not days. Renters get replies within hours — not after a week of phone tag.",
                },
                {
                  icon: Users,
                  title: "Agents deserve better too",
                  body: "Good agents waste hours on unqualified leads. SignalMe sends them only verified, serious renters who have already stated their exact needs. Better quality leads, less wasted time.",
                },
              ].map((v) => (
                <div key={v.title} className="rounded-2xl border bg-card p-6">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{v.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-5 py-14">
          <h2 className="text-2xl font-bold mb-4">How SignalMe works</h2>
          <p className="text-base text-muted-foreground mb-8">
            SignalMe serves two kinds of users: <strong className="text-foreground">renters</strong> looking for property and <strong className="text-foreground">agents</strong> who want to find serious clients.
          </p>
          <div className="space-y-5">
            {[
              {
                title: "For renters — free forever",
                points: [
                  "Post a rental request describing the property type, state, area, and budget",
                  "Verified agents covering that area receive an instant Signal notification",
                  "Agents message you directly with matching properties, photos, and prices",
                  "Chat with agents, arrange viewings, and only pay after you've inspected the property",
                ],
              },
              {
                title: "For agents — Signal Matrix subscription",
                points: [
                  "Set up your Signal Matrix: which states, areas, property types, and budget ranges you cover",
                  "Receive instant notifications whenever a renter posts a matching request",
                  "Respond early — Agent Pro subscribers get early access to new requests",
                  "Build a reputation with ratings from successful rental matches",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="bg-secondary/40 border-y">
          <div className="max-w-4xl mx-auto px-5 py-14">
            <h2 className="text-2xl font-bold mb-4">Where we operate</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              SignalMe covers all 36 states of Nigeria plus the Federal Capital Territory (FCT - Abuja). Our agents are active in all major cities including Lagos, Abuja, Port Harcourt, Ibadan, Kano, Enugu, Benin City, Uyo, Jos, Kaduna, Ilorin, Owerri, Calabar and many more.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mt-4">
              We cover all major property types: 1-room self-contain, mini flats, 2 and 3-bedroom apartments, duplexes, shortlets, shops, office spaces, warehouses and event halls — both for rent and lease.
            </p>
            <Link
              to="/rent"
              className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
            >
              Browse all rental locations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Company */}
        <section className="max-w-4xl mx-auto px-5 py-14">
          <h2 className="text-2xl font-bold mb-4">The company behind SignalMe</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            SignalMe is built and operated by <strong className="text-foreground">Gidsworld Ventures</strong>, a Nigerian technology company focused on solving real, everyday problems for Nigerians through digital products. We started SignalMe because we experienced the frustrations of the Nigerian rental market firsthand — the scams, the wasted trips, the unresponsive agents — and believed there was a smarter way.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            We are committed to building a trustworthy, efficient, and accessible real estate platform for every Nigerian — whether you are looking for a ₦150,000 self-contain in Ibadan or a ₦10 million duplex in Lekki.
          </p>

          <div className="mt-8 rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-3">Get in touch</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Email: <a href="mailto:signalme101@gmail.com" className="text-primary hover:underline">signalme101@gmail.com</a>
            </p>
            <p className="text-sm text-muted-foreground">
              Follow us on{" "}
              <a href="https://www.instagram.com/signalme_1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a>,{" "}
              <a href="https://www.facebook.com/share/17YdcwYHz2/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>, and{" "}
              <a href="https://www.tiktok.com/@signalme_" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TikTok</a>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-5 py-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to find your next property?</h2>
            <p className="mt-3 opacity-90 max-w-xl mx-auto">
              Post a free request in 2 minutes. Verified agents across Nigeria respond with matching properties.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 mt-7 shadow-xl font-semibold">
              <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
                Get started free <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto w-full px-5 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>© SignalMe — Gidsworld Ventures</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
