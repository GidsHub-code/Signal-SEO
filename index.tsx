import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Radar, Search, MessageCircle, ShieldCheck, Zap, Bell, CheckCircle2, ArrowRight, Star, Menu, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { buildHead, ORG_JSON_LD, WEBSITE_JSON_LD, faqJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "SignalMe — Rent Houses, Apartments & Shops in Nigeria | Verified Agents Come to You",
      description:
        "Stop chasing real estate agents. Post what you need — verified Nigerian agents instantly send matching houses, flats, self-contains, shortlets, shops and offices in Lagos, Abuja, Port Harcourt, Ibadan and across Nigeria. Free for renters.",
      path: "/",
      keywords:
        "houses for rent in Lagos, apartments for rent in Abuja, flats for rent Nigeria, self contain Lagos, mini flat Yaba, 2 bedroom flat Lekki, 3 bedroom Ikeja, shortlet Lagos, shop for rent, office space Abuja, real estate agents Nigeria, verified property agents, rent house Port Harcourt, Ibadan apartments, Jiji houses alternative, PropertyPro Nigeria, Nigeria Property Centre alternative, demand first rental, post rental request Nigeria",
      jsonLd: [
        ORG_JSON_LD,
        WEBSITE_JSON_LD,
        faqJsonLd([
          {
            q: "How does SignalMe work?",
            a: "Renters post a free request describing the house, flat or shop they want, the area, and the budget. Verified Nigerian real estate agents who cover that area get an instant Signal and message you with matching properties.",
          },
          {
            q: "Is SignalMe free for renters?",
            a: "Yes. Posting a rental request and chatting with agents is 100% free for renters. You only pay for the property you choose, directly to the agent or landlord.",
          },
          {
            q: "How do I become a verified agent on SignalMe?",
            a: "Sign up as an agent, complete your profile and Signal Matrix coverage (states, areas, property types, budget range). Start with a 1-month free trial of Agent Pro to receive matching client requests automatically.",
          },
          {
            q: "Which Nigerian cities does SignalMe cover?",
            a: "SignalMe is available across all 36 states of Nigeria including Lagos, Abuja (FCT), Port Harcourt, Ibadan, Kano, Benin City, Enugu, Uyo and more.",
          },
          {
            q: "What types of properties can I find?",
            a: "1 Room Self-Contained, mini flats, 1/2/3/4 bedroom apartments and duplexes, shortlets, shops, warehouses and office spaces — both for rent and lease.",
          },
        ]),
      ],
    }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .maybeSingle();
      throw redirect({ to: prof?.role === "agent" ? "/agent" : "/client" });
    }
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
            <Logo className="h-9 w-9 transition-transform group-hover:rotate-6" />
            <span>SignalMe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/auth" search={{ role: "client" }}>Sign in</Link></Button>
            <Button asChild size="sm" className="hidden sm:inline-flex shadow-md hover:shadow-lg transition-shadow"><Link to="/plans">Get started</Link></Button>
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Logo className="h-6 w-6" />
                    SignalMe
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 text-sm">
                  <SheetClose asChild>
                    <a href="#features" className="px-3 py-2.5 rounded-md hover:bg-muted transition-colors">Features</a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#how" className="px-3 py-2.5 rounded-md hover:bg-muted transition-colors">How it works</a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#pricing" className="px-3 py-2.5 rounded-md hover:bg-muted transition-colors">Pricing</a>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/about" className="px-3 py-2.5 rounded-md hover:bg-muted transition-colors">About</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/contact" className="px-3 py-2.5 rounded-md hover:bg-muted transition-colors">Contact</Link>
                  </SheetClose>
                </nav>
                <div className="mt-6 flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button asChild variant="outline" className="w-full"><Link to="/auth" search={{ role: "client" }}>Sign in</Link></Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="w-full"><Link to="/plans">Get started</Link></Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        {/* animated blobs */}
        <div aria-hidden className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div aria-hidden className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }} />
        <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur mb-5 border border-white/20 animate-fade-up">
              <Zap className="h-3.5 w-3.5" /> Made for Nigeria 🇳🇬 & Powered By Gidsworld Ventures
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] animate-fade-up delay-100">
              Stop chasing agents.<br />
              Let them <span className="text-shimmer underline decoration-white/40 decoration-4 underline-offset-4">find you.</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl opacity-90 max-w-xl animate-fade-up delay-200">
              SignalMe is the demand-first rental platform. Post what you need —
              verified agents in your area get a Signal instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up delay-300">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl hover:scale-[1.03] transition-transform">
                <Link to="/auth" search={{ role: "client", plan: "free" } as any}>I'm looking for a property <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:scale-[1.03] transition-transform">
                <Link to="/plans">I'm an agent</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm opacity-90 animate-fade-up delay-400">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Free to post</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Verified agents</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> No payment scams</div>
            </div>
          </div>
          <div className="hidden md:flex justify-center animate-fade-in delay-300">
            <div className="relative animate-float">
              <span aria-hidden className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-110" />
              <Logo className="relative h-72 w-72 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y bg-card">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />4.8 average rating</div>
          <div>·</div>
          <div>Trusted across Lagos, Abuja, PH, Jos, Enugu & Ibadan</div>
          <div>·</div>
          <div>Verified agents only</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-6xl mx-auto w-full px-5 py-20">
        <div aria-hidden className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Why SignalMe</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">A smarter way to rent in Nigeria</h2>
          <p className="text-muted-foreground mt-3">No more endless calls or scams. Tell us what you want — agents come to you.</p>
        </div>
        <div className="relative grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Post what you want", body: "Property type, area, budget. Two minutes and you're done." },
            { icon: Radar, title: "Signal Matrix", body: "We auto-route your request to verified agents covering your area." },
            { icon: MessageCircle, title: "Chat or call", body: "WhatsApp-style chat with voice notes and photos. You're in control." },
          ].map((f, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border bg-card/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:border-primary/40 hover-lift overflow-hidden"
            >
              <div aria-hidden className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)" }} />
              <div className="relative h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative font-semibold text-lg">{f.title}</h3>
              <p className="relative text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-secondary/40 border-y relative overflow-hidden">
        <div aria-hidden className="absolute -top-16 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="relative max-w-6xl mx-auto px-5 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">How it works</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Three steps to your next home</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Post your request", body: "Type, location, budget — done in 2 minutes." },
              { n: "02", title: "Agents get signaled", body: "Matching agents in your area are notified instantly." },
              { n: "03", title: "Chat & inspect", body: "Talk it out, then physically see the property before paying." },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-card border p-6 relative hover-lift hover:shadow-lg hover:border-primary/30">
                <div className="text-5xl font-extrabold text-primary/20">{s.n}</div>
                <h3 className="font-semibold text-lg mt-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto w-full px-5 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Free for renters, fair for agents</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border bg-card p-7 hover-lift hover:shadow-lg hover:border-primary/30">
            <div className="font-semibold">Renter</div>
            <div className="text-4xl font-extrabold mt-2">Free</div>
            <p className="text-sm text-muted-foreground mt-1">Forever, no card required.</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Unlimited requests</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Chat with agents</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Voice notes, photos</li>
            </ul>
            <Button asChild className="w-full mt-6"><Link to="/auth" search={{ role: "client", plan: "free" } as any}>Get started</Link></Button>
          </div>
          <div className="rounded-2xl border bg-card p-7 relative hover-lift hover:shadow-lg hover:border-accent/40">
            <div className="absolute -top-3 left-7 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">1 month free</div>
            <div className="font-semibold">Agent — Free Trial</div>
            <div className="text-4xl font-extrabold mt-2">₦0<span className="text-base font-normal text-muted-foreground"> / first month</span></div>
            <p className="text-sm text-muted-foreground mt-1">Full Agent Pro access for 30 days. No card needed.</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> All Agent Pro features</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Early access to requests</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Priority Signal Matrix</li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-6"><Link to="/auth" search={{ role: "agent", plan: "trial" } as any}>Start free trial</Link></Button>
          </div>
          <div className="rounded-2xl border-2 border-primary bg-card p-7 relative shadow-xl hover-lift hover:shadow-2xl">
            <div className="absolute -top-3 left-7 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">Popular</div>
            <div className="font-semibold">Agent Pro</div>
            <div className="text-4xl font-extrabold mt-2">₦5,500<span className="text-base font-normal text-muted-foreground">/mo</span></div>
            <p className="text-sm text-muted-foreground mt-1">Pay securely via card, transfer or USSD with Flutterwave.</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Early access to new requests</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Boosted visibility</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Priority Signal Matrix</li>
            </ul>
            <Button asChild className="w-full mt-6"><Link to="/auth" search={{ role: "agent", plan: "pro" } as any}>Subscribe</Link></Button>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-primary/5 border-y border-primary/20">
        <div className="max-w-6xl mx-auto px-5 py-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-sm md:text-base">
            <strong>Important Notice:</strong> Never make any payment for a property
            without seeing it physically. SignalMe will never ask you to pay an agent through the app.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative text-primary-foreground overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
        <div aria-hidden className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="relative max-w-4xl mx-auto px-5 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to find your next home?</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">Post your first request in 2 minutes and let the right agents come to you.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 mt-7 shadow-xl hover:scale-[1.03] transition-transform">
            <Link to="/plans">Get started — it's free <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      {/* Location SEO links — internal linking to /rent pages */}
      <section className="border-t bg-secondary/20">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Find property by location</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: "Houses in Lagos", state: "lagos", type: "2-bedroom-flat" },
              { label: "Flats in Abuja", state: "abuja", type: "2-bedroom-flat" },
              { label: "Self-contain in Lagos", state: "lagos", type: "selfcon" },
              { label: "Shops in Lagos", state: "lagos", type: "shop" },
              { label: "Duplex in Abuja", state: "abuja", type: "duplex" },
              { label: "Flats in Port Harcourt", state: "port-harcourt", type: "2-bedroom-flat" },
              { label: "Office in Lagos", state: "lagos", type: "office" },
              { label: "Shortlet in Lekki", state: "lagos", type: "selfcon" },
              { label: "Warehouse Lagos", state: "lagos", type: "warehouse" },
              { label: "3-bedroom Ibadan", state: "ibadan", type: "3-bedroom-flat" },
              { label: "Self-contain Enugu", state: "enugu", type: "selfcon" },
              { label: "Shop Kano", state: "kano", type: "shop" },
            ].map((link) => (
              <Link
                key={link.label}
                to="/rent/$state/$type"
                params={{ state: link.state, type: link.type }}
                className="rounded-full border bg-card px-3 py-1 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/rent" className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary font-medium hover:bg-primary/10 transition-colors">
              Browse all locations →
            </Link>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto w-full px-5 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>© 2025-2026 SignalMe Powered By Gidsworld Ventures</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </nav>
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/share/17YdcwYHz2/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@signalme_?_r=1&_t=ZS-969GuCtNKy5" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-primary transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z"/></svg>
          </a>
          <a href="https://www.instagram.com/signalme_1?igsh=eXcyaDJ3b2xjdzZ0" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.41a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/signalme-pro-367712406?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
