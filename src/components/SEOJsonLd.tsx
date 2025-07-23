import React from 'react';

interface SEOJsonLdProps {
  data: object | object[];
}

const SEOJsonLd: React.FC<SEOJsonLdProps> = ({ data }) => {
  const schemaArray = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemaArray.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
};

export default SEOJsonLd;