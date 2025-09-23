import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ExternalLink, Home, ChevronRight } from 'lucide-react';
import { SEO } from '@/lib/seo';
import { getArticleBySlug } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RawHtmlBlock from '@/components/RawHtmlBlock';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/articles" replace />;
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title={`${article.title} | SummitVoiceAI`}
        description={article.excerpt}
        keywords={article.tags}
      />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/articles">Articles & Reports</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back to Articles Link */}
          <Button variant="ghost" asChild className="mb-6 p-0">
            <Link to="/articles" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.published_at)}
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-4 h-4" />
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <RawHtmlBlock 
              html={article.content_html}
              className="article-content"
            />
          </article>

          {/* Sticky CTA */}
          <div className="sticky bottom-0 bg-gradient-to-r from-primary to-primary/90 p-6 rounded-xl text-center text-primary-foreground shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Ready to Transform Your Business?
            </h3>
            <p className="text-primary-foreground/90 mb-4">
              See how Voice AI can revolutionize your service business with a personalized demo.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3"
            >
              <a
                href={article.cta_calendly_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Book a Demo
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <style>{`
        .article-content {
          line-height: 1.7;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .article-content h1 {
          font-size: 2.25rem;
        }
        
        .article-content h2 {
          font-size: 1.875rem;
        }
        
        .article-content h3 {
          font-size: 1.5rem;
        }
        
        .article-content h4 {
          font-size: 1.25rem;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
        }
        
        .article-content ul,
        .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem auto;
          display: block;
        }
        
        .article-content canvas {
          max-width: 100% !important;
          height: auto !important;
        }
        
        @media (max-width: 768px) {
          .article-content {
            font-size: 1rem;
          }
          
          .article-content h1 {
            font-size: 1.875rem;
          }
          
          .article-content h2 {
            font-size: 1.5rem;
          }
          
          .article-content h3 {
            font-size: 1.25rem;
          }
          
          .article-content h4 {
            font-size: 1.125rem;
          }
          
          .article-content canvas {
            height: 200px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ArticleDetail;