// RSS feed generation for blog posts
import { Metadata } from 'next';

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorSlug: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

// Sample blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Cultural Competency in Mental Health",
    slug: "understanding-cultural-competency-mental-health",
    excerpt: "Exploring how cultural competency enhances mental health outcomes for diverse communities.",
    content: "Full article content here...",
    author: "Dr. Emma Johnson",
    authorSlug: "dr-emma-johnson",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    category: "Mental Health",
    tags: ["cultural competency", "mental health", "therapy"],
    image: "/blog/cultural-competency.jpg",
    featured: true
  },
  {
    id: "2",
    title: "Building Resilience Through Community Connection",
    slug: "building-resilience-community-connection",
    excerpt: "How community connections can help young people build emotional resilience.",
    content: "Full article content here...",
    author: "Amir Bhai",
    authorSlug: "amir-bhai",
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    category: "Community",
    tags: ["resilience", "community", "youth"],
    image: "/blog/community-connection.jpg",
    featured: false
  },
  {
    id: "3",
    title: "Trauma-Informed Care: A Holistic Approach",
    slug: "trauma-informed-care-holistic-approach",
    excerpt: "Understanding trauma-informed care and its importance in mental health services.",
    content: "Full article content here...",
    author: "Dr. Emma Johnson",
    authorSlug: "dr-emma-johnson",
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    category: "Therapy",
    tags: ["trauma", "therapy", "holistic care"],
    image: "/blog/trauma-informed-care.jpg",
    featured: true
  }
];

// Generate RSS feed XML
export function generateRSSFeed(posts: BlogPost[]): string {
  const baseUrl = 'https://right2thriveuk.com';
  const siteName = 'Right2Thrive UK';
  const description = 'Culturally responsive mental health support and wellbeing services for young people and families in North London.';

  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${post.author}</author>
      <category>${post.category}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
      <enclosure url="${baseUrl}${post.image}" type="image/jpeg" />
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${siteName} Blog]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${baseUrl}</link>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/right2thrive-logo.jpg</url>
      <title><![CDATA[${siteName}]]></title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;
}

// Generate Atom feed XML
export function generateAtomFeed(posts: BlogPost[]): string {
  const baseUrl = 'https://right2thriveuk.com';
  const siteName = 'Right2Thrive UK';
  const description = 'Culturally responsive mental health support and wellbeing services for young people and families in North London.';

  const atomEntries = posts.map(post => `
    <entry>
      <title><![CDATA[${post.title}]]></title>
      <summary><![CDATA[${post.excerpt}]]></summary>
      <link href="${baseUrl}/blog/${post.slug}" rel="alternate"/>
      <id>${baseUrl}/blog/${post.slug}</id>
      <published>${new Date(post.publishedAt).toISOString()}</published>
      <updated>${new Date(post.updatedAt).toISOString()}</updated>
      <author>
        <name>${post.author}</name>
        <uri>${baseUrl}/authors/${post.authorSlug}</uri>
      </author>
      <category term="${post.category}" label="${post.category}"/>
      ${post.tags.map(tag => `<category term="${tag}" label="${tag}"/>`).join('')}
      <content type="html"><![CDATA[${post.content}]]></content>
    </entry>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title><![CDATA[${siteName} Blog]]></title>
  <subtitle><![CDATA[${description}]]></subtitle>
  <link href="${baseUrl}" rel="alternate"/>
  <link href="${baseUrl}/atom.xml" rel="self"/>
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name><![CDATA[${siteName}]]></name>
    <email>hello@right2thriveuk.com</email>
  </author>
  <rights>Copyright ${new Date().getFullYear()} ${siteName}</rights>
  ${atomEntries}
</feed>`;
}

// Generate JSON Feed
export function generateJSONFeed(posts: BlogPost[]): object {
  const baseUrl = 'https://right2thriveuk.com';
  const siteName = 'Right2Thrive UK';
  const description = 'Culturally responsive mental health support and wellbeing services for young people and families in North London.';

  return {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteName} Blog`,
    description: description,
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    language: "en-gb",
    favicon: `${baseUrl}/favicon.ico`,
    icon: `${baseUrl}/right2thrive-logo.jpg`,
    authors: [
      {
        name: siteName,
        url: baseUrl,
        email: "hello@right2thriveuk.com"
      }
    ],
    items: posts.map(post => ({
      id: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.content,
      content_text: post.excerpt,
      summary: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      external_url: `${baseUrl}/blog/${post.slug}`,
      date_published: post.publishedAt,
      date_modified: post.updatedAt,
      authors: [
        {
          name: post.author,
          url: `${baseUrl}/authors/${post.authorSlug}`
        }
      ],
      tags: post.tags,
      language: "en-gb",
      image: `${baseUrl}${post.image}`,
      banner_image: `${baseUrl}${post.image}`,
      attachments: [
        {
          url: `${baseUrl}${post.image}`,
          mime_type: "image/jpeg",
          title: post.title,
          size_in_bytes: 0
        }
      ]
    }))
  };
}

// Get recent posts for RSS feed
export function getRecentPosts(limit: number = 10): BlogPost[] {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

// Get posts by author
export function getPostsByAuthor(authorSlug: string): BlogPost[] {
  return blogPosts.filter(post => post.authorSlug === authorSlug);
}

// Search posts
export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.category.toLowerCase().includes(lowercaseQuery)
  );
}

export default blogPosts;
