import React from 'react';
const videos = [{
  title: 'AI Realtor Demo',
  url: 'https://www.youtube.com/embed/j5c4RmZk7Pc'
}, {
  title: 'AI Deck & Landscaping Demo',
  url: 'https://www.youtube.com/embed/p59_ZOmgodk'
}, {
  title: 'AI Roofing Demo',
  url: 'https://www.youtube.com/embed/ly-UhP_91H0'
}, {
  title: 'AI Pool Demo',
  url: 'https://www.youtube.com/embed/Uu35W1wtAZA'
}];
const DemoSection: React.FC = () => <section id="demo-calls" className="section-padding bg-background">
    <div className="container mx-auto">
      <h2 className="heading-lg text-center mb-12">SummitVoiceAI Demo Calls</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {videos.map((vid, i) => <div key={i} className="flex flex-col items-center">
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe src={vid.url} title={vid.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
            <p className="mt-3 text-center font-medium">{vid.title}</p>
          </div>)}
      </div>
    </div>
  </section>;
export default DemoSection;