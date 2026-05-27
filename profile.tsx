import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { NIGERIA_STATES, PROPERTY_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { ShieldCheck, Bell, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
    }
  }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    refreshProfile();
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="rounded-2xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {(profile?.full_name?.[0] ?? "S").toUpperCase()}
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              {profile?.full_name || "Unnamed"}
              {profile?.verified && <Badge className="gap-1 bg-success text-primary-foreground"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
            </div>
            <div className="text-xs text-muted-foreground capitalize">{profile?.role}</div>
          </div>
        </div>
        <div>
          <Label>Full name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </div>

      <Link
        to="/profile/notifications"
        className="mt-4 rounded-2xl border bg-card p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">Notifications</div>
            <div className="text-xs text-muted-foreground">Push alerts, devices, PWA status</div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {profile?.role === "agent" && <AgentPrefs />}
    </AppShell>
  );
}

function AgentPrefs() {
  const { user } = useAuth();
  const [states, setStates] = useState<string[]>([]);
  const [areasText, setAreasText] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [minB, setMinB] = useState("0");
  const [maxB, setMaxB] = useState("100000000");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("agent_preferences").select("*").eq("agent_id", user.id).maybeSingle();
      if (data) {
        setStates(data.states ?? []);
        setAreasText((data.areas ?? []).join(", "));
        setTypes((data.property_types as string[]) ?? []);
        setMinB(String(data.min_budget ?? 0));
        setMaxB(String(data.max_budget ?? 0));
      }
    })();
  }, [user]);

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const areas = areasText.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = {
      agent_id: user.id,
      states,
      areas,
      property_types: types as any,
      min_budget: Number(minB),
      max_budget: Number(maxB),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("agent_preferences").upsert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Signal Matrix updated");
  };

  return (
    <div className="rounded-2xl border bg-card p-4 mt-4 space-y-4">
      <div>
        <h2 className="font-semibold">Signal Matrix coverage</h2>
        <p className="text-xs text-muted-foreground">Get notified when matching client requests come in.</p>
      </div>

      <div>
        <Label className="mb-2 block">States you cover</Label>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border rounded-lg">
          {NIGERIA_STATES.map((s) => (
            <button key={s} type="button" onClick={() => setStates(toggle(states, s))}
              className={`text-xs rounded-full px-3 py-1 border transition ${states.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Areas (comma-separated, optional)</Label>
        <Input value={areasText} onChange={(e) => setAreasText(e.target.value)} placeholder="Yaba, Lekki, Ikeja" />
        <p className="text-xs text-muted-foreground mt-1">Leave blank to receive all areas in your states.</p>
      </div>

      <div>
        <Label className="mb-2 block">Property types</Label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((p) => (
            <button key={p.value} type="button" onClick={() => setTypes(toggle(types, p.value))}
              className={`text-xs rounded-full px-3 py-1 border transition ${types.includes(p.value) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min budget (₦)</Label>
          <Input inputMode="numeric" value={minB} onChange={(e) => setMinB(e.target.value.replace(/[^0-9]/g, ""))} />
        </div>
        <div>
          <Label>Max budget (₦)</Label>
          <Input inputMode="numeric" value={maxB} onChange={(e) => setMaxB(e.target.value.replace(/[^0-9]/g, ""))} />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save coverage"}</Button>
    </div>
  );
}
