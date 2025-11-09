import { NextRequest, NextResponse } from 'next/server';
import { generateRSSFeed, generateAtomFeed, generateJSONFeed, getRecentPosts } from '@/lib/blog-posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'rss';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const posts = getRecentPosts(limit);
    let content: string;
    let contentType: string;

    switch (format.toLowerCase()) {
      case 'atom':
        content = generateAtomFeed(posts);
        contentType = 'application/atom+xml';
        break;
      case 'json':
        const jsonFeed = generateJSONFeed(posts);
        content = JSON.stringify(jsonFeed, null, 2);
        contentType = 'application/json';
        break;
      case 'rss':
      default:
        content = generateRSSFeed(posts);
        contentType = 'application/rss+xml';
        break;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
