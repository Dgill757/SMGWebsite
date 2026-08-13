import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { SEO } from '@/lib/seo';
import { getAllArticles, getArticlesByTag } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Articles: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const articles = selectedTag ? getArticlesByTag(selectedTag) : getAllArticles();
  
  // Get all unique tags
  const allTags = Array.from(new Set(getAllArticles().flatMap(article => article.tags)));

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
        title="Articles & Reports | Insights, Statistics & Case Studies"
        description="Actionable industry insights, AI statistics, and lead-generation reports for service businesses."
        keywords={["voice ai articles", "industry reports", "service business insights", "AI statistics", "lead generation"]}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Articles & Reports
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover actionable industry insights, cutting-edge AI statistics, and proven lead-generation strategies that help service businesses thrive in the digital age.
            </p>
          </div>

          {/* Tag Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedTag === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag('')}
                className="mb-2"
              >
                All Articles
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="mb-2 capitalize"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {articles.map((article) => (
              <Card key={article.slug} className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {article.thumbnail && (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.published_at)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs capitalize">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/articles/${article.slug}`}>
                      Read Article
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Global CTA Section */}
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to see this in action?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Discover how Voice AI can transform your service business with a personalized demo tailored to your industry and needs.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3"
            >
              <a
                href="https://calendly.com/aivoice/call"
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
    </>
  );
};

export default Articles;