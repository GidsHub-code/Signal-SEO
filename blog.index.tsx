/**
 * BLOG INDEX — /blog
 * Lists all blog posts. Good for Google to discover + index all posts.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { blogs } from "@/data/blogs";
import { buildHead, breadcrumbJsonLd, ORG_JSON_LD } from "@/lib/seo";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () =>
    buildHead({
      title: "SignalMe Blog — Real Estate Tips, Rental Guides & Nigeria Property Advice",
      description:
        "Expert rental guides for Nigeria. Learn how to rent safely in Lagos, find cheap apartments in Abuja, avoid fake agents, understand agency fees, and more.",
      path: "/blog",
      keywords:
        "Nigeria real estate blog, renting in Lagos guide, Abuja rental tips, how to rent house Nigeria, agency fee explained, avoid property scams Nigeria, SignalMe blog, Nigerian tenant guide",
      jsonLd: [
        ORG_JSON_LD,
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]),
      ],
    }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="px-5 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="h-9 w-9" />
            <span>SignalMe</span>
          </Link>
          <Button asChild size="sm">
            <Link to="/plans">Get started free</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-5 py-12 flex-1">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link> / <span className="text-foreground">Blog</span>
        </nav>
        <h1 className="text-4xl font-extrabold mb-2">SignalMe Blog</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Rental guides, tenant tips and property market insights for Nigeria.
        </p>

        <div className="space-y-6">
          {blogs.map((post) => (
            <article key={post.slug} className="border-b pb-6">
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group"
              >
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{post.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.datePublished}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t px-5 py-6 text-sm text-muted-foreground flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2"><Logo className="h-5 w-5" /><span>© SignalMe</span></div>
        <nav className="flex gap-4">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}
