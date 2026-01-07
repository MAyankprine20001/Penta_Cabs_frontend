import { MetadataRoute } from 'next';
import { environment } from '@/config/environment';

// Base URL for the site
const baseUrl = 'https://www.pentacab.com';

interface BlogPost {
  id: string;
  status: 'draft' | 'published';
}

interface Route {
  id: string;
  routeName: string;
  status: 'active' | 'inactive';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || environment.baseUrl;

  // Static routes with their priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cab-booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cab-detail`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cab-lists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/confirm`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/intercity-booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/outstation-booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/popular_route_info`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogResponse = await fetch(`${apiUrl}/blogs?status=published&limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      if (blogData.success && blogData.data) {
        blogRoutes = blogData.data.map((blog: BlogPost) => ({
          url: `${baseUrl}/blog/${blog.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Fetch dynamic route pages
  let routePages: MetadataRoute.Sitemap = [];
  try {
    const routeResponse = await fetch(`${apiUrl}/routes?status=active&limit=200`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (routeResponse.ok) {
      const routeData = await routeResponse.json();
      if (routeData.success && routeData.data) {
        routePages = routeData.data.map((route: Route) => {
          // Create a URL-friendly route name
          const routeName = route.routeName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          
          return {
            url: `${baseUrl}/routes/${routeName}/${route.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          };
        });
      }
    }
  } catch (error) {
    console.error('Error fetching routes for sitemap:', error);
  }

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...routePages];
}

