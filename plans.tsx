import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Crown, Home } from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { buildHead, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/plans")({
  head: () =>
    buildHead({
      title: "Plans & Pricing — SignalMe Renter & Agent Pro",
      description:
        "Renters use SignalMe free forever. Agents start with a 1-month free trial then upgrade to Agent Pro to unlock unlimited matching client requests across Nigeria.",
      path: "/plans",
      keywords:
        "SignalMe pricing, real estate agent subscription Nigeria, agent pro plan, free property leads Nigeria, rent platform subscription, agent trial Nigeria",
      jsonLd: breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Plans", path: "/plans" }]),
    }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    // Already signed-in users skip plans and go straight to their dashboard
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
  component: PlansPage,
});

function PlansPage() {
  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b">
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="h-9 w-9" />
            <span>SignalMe</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth" search={{ role: "client" }}>I already have an account</Link>
          </Button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto w-full px-5 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Get started</div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Pick a plan to continue</h1>
          <p className="text-muted-foreground mt-3">
            Your selection determines whether you sign up as a Renter or an Agent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Renter */}
          <div className="rounded-2xl border bg-card p-7 flex flex-col">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="font-semibold">Renter</span>
            </div>
            <div className="text-4xl font-extrabold mt-2">Free</div>
            <p className="text-sm text-muted-foreground mt-1">Forever, no card required.</p>
            <ul className="mt-5 space-y-2 text-sm flex-1">
              <Feat>Unlimited rental requests</Feat>
              <Feat>Chat with verified agents</Feat>
              <Feat>Voice notes &amp; photos</Feat>
            </ul>
            <Button asChild className="w-full mt-6">
              <Link to="/auth" search={{ role: "client", plan: "free" } as any}>Continue as Renter</Link>
            </Button>
          </div>

          {/* Agent Free Trial */}
          <div className="rounded-2xl border bg-card p-7 relative flex flex-col">
            <div className="absolute -top-3 left-7 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              1 month free
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Agent — Free Trial</span>
            </div>
            <div className="text-4xl font-extrabold mt-2">
              ₦0<span className="text-base font-normal text-muted-foreground"> / first month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Full Agent Pro access for 30 days.</p>
            <ul className="mt-5 space-y-2 text-sm flex-1">
              <Feat>All Agent Pro features</Feat>
              <Feat>Early access to new requests</Feat>
              <Feat>Priority Signal Matrix</Feat>
              <Feat>No card required</Feat>
            </ul>
            <Button asChild variant="outline" className="w-full mt-6">
              <Link to="/auth" search={{ role: "agent", plan: "trial" } as any}>Start free trial</Link>
            </Button>
          </div>

          {/* Agent Pro */}
          <div className="rounded-2xl border-2 border-primary bg-card p-7 relative shadow-xl flex flex-col">
            <div className="absolute -top-3 left-7 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              Most popular
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-semibold">Agent Pro</span>
            </div>
            <div className="text-4xl font-extrabold mt-2">
              ₦5,500<span className="text-base font-normal text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Pay securely with Flutterwave.</p>
            <ul className="mt-5 space-y-2 text-sm flex-1">
              <Feat>Early access to new requests</Feat>
              <Feat>Boosted visibility</Feat>
              <Feat>Priority Signal Matrix</Feat>
              <Feat>Cancel anytime</Feat>
            </ul>
            <Button asChild className="w-full mt-6">
              <Link to="/auth" search={{ role: "agent", plan: "pro" } as any}>Subscribe &amp; sign up</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Already have an account?{" "}
          <Link to="/auth" search={{ role: "client" }} className="underline hover:text-foreground">
            Sign in here
          </Link>
        </p>
      </section>
    </div>
  );
}

function Feat({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> {children}
    </li>
  );
}
