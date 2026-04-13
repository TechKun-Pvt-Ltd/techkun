'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
interface Post{
  id:number;
  title:string;
  author: string;
    authorAvatar: string;
    date: string;
    description: string;
    category: string;
    readTime: string;
  content: string[];

}

// Sample blog data - in a real app, you would fetch this from an API or CMS
const blogPosts :Post[]= [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    author: "Sarah Johnson",
    authorAvatar: "/images/avatars/avatar-1.jpg",
    date: "March 15, 2023",
    description: "Exploring how artificial intelligence is revolutionizing the way we build and interact with web applications.",
    category: "Technology",
    readTime: "5 min read",
    content: [
      "Artificial Intelligence is rapidly transforming the landscape of web development, introducing new paradigms that were once considered science fiction. As we move further into the digital age, AI-powered tools and frameworks are becoming increasingly sophisticated, enabling developers to create more intuitive, responsive, and personalized web experiences than ever before.",
      "One of the most significant impacts of AI on web development is in the realm of automated coding and debugging. AI assistants can now generate code snippets, complete functions, and even identify potential bugs before they cause issues in production. This not only accelerates the development process but also helps reduce the cognitive load on developers, allowing them to focus on more creative and strategic aspects of their projects. Tools like GitHub Copilot and TabNine are leading this revolution, using machine learning models trained on vast repositories of code to provide intelligent suggestions and autocompletions.",
      "User experience is another area where AI is making substantial inroads. Chatbots and virtual assistants have evolved from simple rule-based systems to sophisticated conversational agents capable of understanding context, sentiment, and even humor. These AI-powered interfaces are becoming standard features on many websites, providing instant customer support, personalized recommendations, and engaging interactions. The integration of natural language processing (NLP) allows these systems to understand and respond to user queries in a more human-like manner, blurring the line between automated and human interactions.",
      "Personalization is perhaps one of the most powerful applications of AI in web development. By analyzing user behavior, preferences, and historical data, AI algorithms can dynamically adjust content, layouts, and functionality to create tailored experiences for each visitor. This level of personalization goes beyond simple A/B testing, enabling websites to evolve in real-time based on user interactions. From e-commerce product recommendations to content curation on news sites, AI-driven personalization is becoming an expectation rather than a luxury.",
      "Looking ahead, the integration of AI with emerging technologies like augmented reality (AR) and virtual reality (VR) promises to create even more immersive web experiences. Imagine websites that can adapt not just to user preferences but to their physical environment, emotional state, or even health metrics. As AI continues to advance, we can expect web applications to become more predictive, proactive, and deeply integrated into our daily lives. The future of web development is not just about building sites and applications; it's about creating intelligent digital ecosystems that understand and anticipate human needs."
    ]
  },
  {
    id: 2,
    title: "Building Scalable Microservices with Node.js",
    author: "Michael Chen",
    authorAvatar: "/images/avatars/avatar-2.jpg",
    date: "February 28, 2023",
    description: "A comprehensive guide to architecting and implementing microservices using Node.js and Docker.",
    category: "Development",
    readTime: "8 min read",
    content: [
      "Microservices architecture has revolutionized how we build and scale applications, offering unprecedented flexibility and resilience. Node.js, with its lightweight and event-driven nature, has emerged as an ideal technology for implementing microservices. This approach allows development teams to break down complex applications into smaller, manageable services that can be developed, deployed, and scaled independently.",
      "The foundation of successful microservices implementation begins with thoughtful service boundaries. Each microservice should encapsulate a specific business capability and maintain its own data store. This domain-driven design approach ensures that services remain focused and cohesive. With Node.js, developers can leverage its non-blocking I/O model to handle multiple concurrent requests efficiently, making it particularly well-suited for microservices that need to process numerous lightweight operations.",
      "Communication between microservices is a critical aspect of the architecture. RESTful APIs remain popular for synchronous communication, but many teams are increasingly adopting event-driven patterns using message brokers like RabbitMQ or Kafka. These asynchronous communication methods help reduce coupling between services and improve system resilience. Node.js excels in this area, with libraries like amqplib and kafkajs providing robust integrations with these messaging systems.",
      "Containerization with Docker has become the standard approach for packaging and deploying microservices. Docker containers encapsulate each service along with its dependencies, ensuring consistency across different environments. When combined with orchestration tools like Kubernetes, teams can automate deployment, scaling, and management of containerized Node.js microservices. This infrastructure approach enables truly elastic scaling, allowing services to scale up or down based on demand.",
      "Monitoring and observability are essential when managing a distributed microservices ecosystem. Implementing comprehensive logging, metrics collection, and distributed tracing helps teams understand system behavior and quickly identify issues. Tools like Prometheus for metrics, Elasticsearch for logs, and Jaeger for tracing can be integrated with Node.js applications to provide deep insights into service performance and health. As microservices architectures mature, these observability practices become increasingly important for maintaining system reliability and performance."
    ]
  },
  {
    id: 3,
    title: "Mastering CSS Grid for Modern Layouts",
    author: "Emily Rodriguez",
    authorAvatar: "/images/avatars/avatar-3.jpg",
    date: "February 12, 2023",
    description: "Learn how to create complex, responsive layouts with CSS Grid that work across all modern browsers.",
    category: "Design",
    readTime: "6 min read",
    content: [
      "CSS Grid has revolutionized how we approach web layouts, providing a two-dimensional system that allows developers to create complex, responsive designs with minimal code. Unlike Flexbox, which primarily handles one-dimensional layouts, Grid excels at organizing content both horizontally and vertically, making it perfect for modern web applications.",
      "At its core, CSS Grid works by dividing a container into rows and columns, creating a matrix of cells where content can be precisely placed. The basic implementation requires just a few lines of code: `display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; gap: 20px;`. This creates a three-column layout with equal width columns (using the flexible `fr` unit) and automatically sized rows, with 20px spacing between all grid items.",
      "What makes Grid truly powerful is its ability to handle complex layouts through named areas and line positioning. For instance, you can create a classic magazine layout with grid-template-areas, making your layout intentions clear and maintainable, while providing a visual representation of the page structure directly in your CSS.",
      "One of Grid's most powerful features is its ability to create responsive layouts with minimal or no media queries using functions like `minmax()` and `auto-fit`/`auto-fill`. A single declaration like `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` creates a responsive gallery that automatically adjusts the number of columns based on available space, ensuring items are never smaller than 250px wide.",
      "While Grid excels at two-dimensional layouts, Flexbox remains superior for one-dimensional arrangements. The best modern interfaces use both: Grid for overall page layout and complex two-dimensional structures, and Flexbox for alignment within grid cells, navigation bars, and component layouts.",
      "CSS Grid is now supported in all modern browsers, but for projects requiring legacy browser support, you can implement graceful fallbacks using @supports feature queries. This allows you to provide a simpler layout for older browsers while leveraging Grid's power in modern ones.",
      "CSS Grid has transformed web layout design from a hack-filled compromise to a powerful, intentional system. By mastering Grid, you'll write cleaner markup, create more maintainable layouts, and build truly responsive designs that work across all screen sizes. Combined with Flexbox and modern CSS features like Custom Properties, Grid forms the foundation of contemporary web design."
    ]
  },
  {
    id: 4,
    title: "The Complete Guide to React Hooks",
    author: "David Kim",
    authorAvatar: "/images/avatars/avatar-4.jpg",
    date: "January 25, 2023",
    description: "Everything you need to know about React Hooks and how they can simplify your component logic.",
    category: "React",
    readTime: "7 min read",
    content: [
      "React Hooks, introduced in React 16.8, represent one of the most significant shifts in React development. They allow you to use state and other React features without writing classes, enabling a more functional approach to building components. This guide explores the core hooks, custom hook patterns, and best practices for leveraging hooks in your applications.",
      "The `useState` hook provides a way to add state to functional components. Unlike class components where all state is stored in a single object, `useState` lets you split state into multiple, independent variables, making your code more readable and maintainable. A simple counter component can be implemented with just a few lines of code using useState.",
      "The `useEffect` hook handles side effects in functional components, replacing lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. This unified API simplifies managing effects like data fetching, subscriptions, or manually changing the DOM. The dependency array is crucial - it tells React when to re-run the effect, preventing unnecessary operations and potential bugs.",
      "The `useContext` hook provides a cleaner way to consume context values, eliminating the need for context consumer components and resulting in more readable code. This is particularly useful for themes, user authentication, or any data that needs to be accessible throughout your component tree.",
      "For complex state logic, `useReducer` provides a Redux-like approach within a component. This is ideal for state that involves multiple sub-values or when the next state depends on the previous one. It helps organize state transitions and makes them more predictable, especially for complex UI interactions.",
      "Performance optimization hooks like `useCallback` and `useMemo` help prevent unnecessary re-renders by memoizing functions and values. `useCallback` returns a memoized version of a callback that only changes if one of the dependencies has changed, while `useMemo` does the same for computed values. These are essential tools for optimizing components that rely on expensive calculations or that pass callbacks to highly optimized child components.",
      "Custom hooks allow you to extract component logic into reusable functions. For example, a custom `useForm` hook can encapsulate form handling logic including state management, validation, and submission handling. This pattern promotes code reuse and separation of concerns, making your components cleaner and more focused on rendering.",
      "To use hooks correctly, follow these essential rules: only call hooks at the top level (never inside loops, conditions, or nested functions), only call hooks from React function components or custom hooks, and name custom hooks starting with 'use' to follow convention and enable linting.",
      "React Hooks have transformed how we build React applications, enabling more functional, reusable, and testable code. By mastering hooks, you can write cleaner components, share logic more effectively, and build more maintainable applications. As the React ecosystem continues to evolve around hooks, they've become an essential skill for modern React development."
    ]
  },
  {
    id: 5,
    title: "Optimizing Web Performance for Core Web Vitals",
    author: "Lisa Patel",
    authorAvatar: "/images/avatars/avatar-5.jpg",
    date: "January 10, 2023",
    description: "Strategies and techniques to improve your website's Core Web Vitals scores and boost SEO rankings.",
    category: "Performance",
    readTime: "9 min read",
    content: [
      // Add content here if needed
    ]
  },
  {
    id: 6,
    title: "Introduction to TypeScript for JavaScript Developers",
    author: "James Wilson",
    authorAvatar: "/images/avatars/avatar-6.jpg",
    date: "December 18, 2022",
    description: "A beginner-friendly guide to TypeScript and how it can help you write more robust JavaScript code.",
    category: "TypeScript",
    readTime: "6 min read",
    content: [
      // Add content here if needed
    ]
  }
];

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<Post|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch the blog post data from an API
    // For this example, we're using the static data above
    const id = parseInt(params.id as string);
    const foundPost = blogPosts.find(post => post.id === id);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} | TechKun Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] pt-8 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.article 
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category Tag */}
            <div className="pt-8 px-6 md:px-10">
              <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
            
            {/* Title */}
            <div className="px-6 md:px-10 pt-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </div>
            
            {/* Author and Meta Info */}
            <div className="px-6 md:px-10 pt-6 pb-8 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="text-base font-medium text-gray-900">{post.author}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Content */}
            <div className="px-6 md:px-10 py-8">
              <div className="prose prose-lg max-w-none">
                {post.content.map((paragraph: string, index: number) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Back to Blogs Link */}
            <div className="px-6 md:px-10 py-8 bg-gray-50 border-t border-gray-100">
              <Link 
                href="/blog" 
                className="inline-flex items-center text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg 
                  className="mr-2 w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blogs
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
}

// Helper function to get category color
function getCategoryColor(category: string) {
  switch(category) {
    case "Technology":
      return "bg-blue-100 text-blue-800";
    case "Development":
      return "bg-indigo-100 text-indigo-800";
    case "Design":
      return "bg-purple-100 text-purple-800";
    case "React":
      return "bg-cyan-100 text-cyan-800";
    case "Performance":
      return "bg-amber-100 text-amber-800";
    case "TypeScript":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}