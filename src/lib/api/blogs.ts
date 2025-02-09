
const BASE_URL = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const BLOG_QUERY = `
query {
  blogPostCollection(limit: 100) {
    items {
      sys {
        id
      }
      title
      slug
      excerpt
      content {
        json
      
      }
      category{
        ... on Categories {
          name
        }
      }
      image {
        url
      }
      publishDate
      author {
        ... on Authors {
          name
          avatar {
            url
          }
          role
        }
      }
      
      
      readTime
    }
  }
}
`;

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: {
        name: string;
    };
    image: string;
    publishDate: string;
    readTime: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
}

const fetchGraphQL = async (query: string) => {
    console.log(BASE_URL)
    const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID ?? 'xmgs91wbscbl'}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Contentful-User-Agent': 'app:predictionsport.com',
            Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN ?? 'rLidzoPaixPmFr0yjf2F6sFgXzpoueVCSQoWVEgbjN8'}`,
        },
        body: JSON.stringify({
            query,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return response.json();
};

export const getBlogPosts = async () => {
    const { data } = await fetchGraphQL(BLOG_QUERY);
    const { blogPostCollection } = data;
    return blogPostCollection.items.map((item: any) => ({
        id: item.sys.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        image: item.image.url,
        publishDate: item.publishDate,
        readTime: item.readTime,
        author: {
            name: item.author.name,
            avatar: item.author.avatar.url,
            role: item.author.role,
        },
        tags: item.tags,
    }));
};

export const getBlogPost = async (slug: string) => {
    const { data } = await fetchGraphQL(BLOG_QUERY);
    const { blogPostCollection } = data;
    const post = blogPostCollection.items.find((item: any) => item.slug === slug);
    if (!post) {
        throw new Error(`Blog post not found: ${slug}`);
    }
    return {
        id: post.sys.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        image: post.image.url,
        content: post.content,
        publishDate: post.publishDate,
        readTime: post.readTime,
        author: {
            name: post.author.name,
            avatar: post.author.avatar.url,
            role: post.author.role,
        },
        // tags: post.tags,
    };
};

 export const getBlogCategories = async () => {
    const { data } = await fetchGraphQL(BLOG_QUERY);
    const { blogPostCollection } = data;

    const categories = new Set(blogPostCollection.items.map((item: any) => item.category));
    console.log('categories ', categories)
    return [...categories];
};