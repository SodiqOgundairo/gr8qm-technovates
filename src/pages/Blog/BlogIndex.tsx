import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import { SEO } from "../../components/common/SEO";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import ScrollReveal from "../../components/common/ScrollReveal";
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  view_count: number;
}

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, featured_image, published_at, view_count",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Blog - Design, Tech & Training Insights"
        description="Expert insights on UX design, product development, tech training, and digital strategy from the Gr8QM Technovates team in Lagos, Nigeria."
        keywords={[
          "design blog",
          "tech blog Nigeria",
          "UX design insights",
          "product design articles",
          "tech training blog",
          "digital agency blog Lagos",
        ]}
        type="blog"
        url="/blog"
        structuredData={[
          generateBlogSchema(),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://gr8qm.com/" },
            { name: "Blog", url: "https://gr8qm.com/blog" },
          ]),
        ]}
      />
      <main>
        {/* Hero Section */}
        <div className="py-20 bg-linear-to-b from-skyblue/10 to-white">
          <Container className="text-center">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-black text-oxford mb-6">
                Our <span className="text-skyblue">Latest Insights</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Thoughts, stories, and ideas from the Gr8QM team.
              </p>
            </ScrollReveal>
          </Container>
        </div>

        {/* Blog Grid */}
        <div className="py-16 bg-white">
          <Container>
            {loading ? (
              <div className="text-center py-20 text-gray-500">
                Loading articles...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-400">
                  No posts yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Check back soon for new content!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 0.1}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block h-full"
                    >
                      <article className="bg-white border boundary-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video bg-gray-200 overflow-hidden relative">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <span className="text-4xl">📰</span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-oxford shadow-sm">
                            Blog
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {Math.ceil(post.excerpt?.length / 200 || 5)} min
                              read
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-oxford group-hover:text-skyblue transition-colors mb-3 line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                            {post.excerpt || "Click to read more..."}
                          </p>

                          <div className="pt-4 border-t border-gray-100 flex items-center text-skyblue font-semibold text-sm group-hover:gap-2 transition-all">
                            Read Article <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </Container>
        </div>
      </main>
    </>
  );
};

export default BlogIndex;
