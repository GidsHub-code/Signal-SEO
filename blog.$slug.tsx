/**
 * BLOG POST PAGE — /blog/$slug
 * Full Article rendering with:
 *  - SEO head (title, description, keywords, canonical)
 *  - Article JSON-LD schema
 *  - BreadcrumbList JSON-LD
 *  - Full HTML content rendering
 *  - Related posts + CTA
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogs } from "@/data/blogs";
import { buildHead, articleJsonLd, breadcrumbJsonLd, ORG_JSON_LD } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const blog = blogs.find((b) => b.slug === params.slug);
    if (!blog) return { meta: [{ title: "Post not found — SignalMe" }], links: [], scripts: [] };

    return buildHead({
      title: `${blog.title} | SignalMe Blog`,
      description: blog.description,
      path: `/blog/${blog.slug}`,
      keywords: blog.keywords,
      jsonLd: [
        articleJsonLd({
          title: blog.title,
          description: blog.description,
          slug: blog.slug,
          datePublished: blog.datePublished,
          dateModified: blog.dateModified || blog.datePublished,
        }),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: blog.title, path: `/blog/${blog.slug}` },
        ]),
        ORG_JSON_LD,
      ],
    });
  },

  loader: ({ params }) => {
    const blog = blogs.find((b) => b.slug === params.slug);
    if (!blog) throw notFound();
    return { blog };
  },

  component: BlogPostPage,

  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Post not found</h1>
        <Link to="/" className="text-primary hover:underline">← Back to SignalMe</Link>
      </div>
    </div>
  ),
});

function BlogPostPage() {
  const { blog } = Route.useLoaderData();
  const related = blogs.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
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

      <main className="max-w-3xl mx-auto w-full px-5 py-10 flex-1">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {" / "}
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          {" / "}
          <span className="text-foreground line-clamp-1">{blog.title}</span>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(blog.datePublished).toLocaleDateString("en-NG", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {blog.readTime}
              </span>
              <span className="text-primary font-medium">SignalMe</span>
            </div>
          </header>

          {/* Article content */}
          <div
            className="prose-custom text-base leading-relaxed"
            style={{
              "--prose-h2": "1.3rem",
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* CTA box */}
        <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Ready to find your next rental?</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
            Post what you need for free — verified Nigerian agents respond instantly with matching properties.
          </p>
          <Button asChild size="lg">
            <Link to="/auth" search={{ role: "client", plan: "free" } as any}>
              Post a free request <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold mb-6">More from SignalMe Blog</h2>
            <div className="space-y-5">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group block rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                  <span className="text-xs text-primary mt-2 flex items-center gap-1">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Link to="/blog" className="text-primary text-sm hover:underline flex items-center gap-1">
            ← All blog posts
          </Link>
        </div>
      </main>

      <footer className="border-t px-5 py-6 text-sm text-muted-foreground flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span>© 2025-2026 SignalMe</span>
        </div>
        <nav className="flex gap-4">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
