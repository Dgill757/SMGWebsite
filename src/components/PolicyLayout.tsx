
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from '@/lib/seo';
import { metaFor } from '@/data/seoRoutes';

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ children, title }) => {
  const { pathname } = useLocation();
  const meta = metaFor(pathname);
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {meta && <SEO title={meta.title} description={meta.description} />}
      <main className="flex-grow container mx-auto pb-12 px-4 md:px-6" style={{ paddingTop: 'var(--page-top)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="hover:underline mb-6 inline-flex items-center" style={{ color: '#00D9FF' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-8">{title}</h1>
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolicyLayout;
