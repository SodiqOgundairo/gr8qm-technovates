import fs from 'fs';
import path from 'path';

const generateSitemap = () => {
  const baseUrl = 'https://www.gr8qmtechnovates.com'; // Replace with your actual domain
  const pages = ['/', '/about', '/trainings', '/contact'];
  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const route = page === '/' ? '' : page;
          return `
            <url>
              <loc>${baseUrl}${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>${page === '/' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const publicPath = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap.trim());
  console.log('Sitemap generated successfully!');
};

generateSitemap();
