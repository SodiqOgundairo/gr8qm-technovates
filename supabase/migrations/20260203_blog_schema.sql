-- Create Blog Tables

-- Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB, -- Storing TipTap JSON content
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- SEO Fields
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[], -- Array of keywords
  
  -- Status and Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction Table: Posts <-> Categories
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Junction Table: Posts <-> Tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- RLS Policies

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Policies for Categories (Public Read, Admin Write)
CREATE POLICY "Public categories are viewable by everyone" 
ON blog_categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" 
ON blog_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update categories" 
ON blog_categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete categories" 
ON blog_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for Tags (Public Read, Admin Write)
CREATE POLICY "Public tags are viewable by everyone" 
ON blog_tags FOR SELECT USING (true);

CREATE POLICY "Admins can insert tags" 
ON blog_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update tags" 
ON blog_tags FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete tags" 
ON blog_tags FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for Posts
-- Public can read published posts
CREATE POLICY "Public published posts are viewable by everyone" 
ON blog_posts FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- Admins can read all posts
CREATE POLICY "Admins can read all posts" 
ON blog_posts FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can insert/update/delete posts
CREATE POLICY "Admins can insert posts" 
ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update posts" 
ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete posts" 
ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for Junction Tables (Public Read, Admin Write)
CREATE POLICY "Public post categories are viewable" 
ON blog_post_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage post categories" 
ON blog_post_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public post tags are viewable" 
ON blog_post_tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage post tags" 
ON blog_post_tags FOR ALL USING (auth.role() = 'authenticated');

-- Auto update updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
