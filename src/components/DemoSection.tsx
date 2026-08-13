
import React from 'react';
const videos = [{
  title: 'AI Realtor Demo',
  url: '/Demo-videos/Real-Estate-Demo.mp4'
}, {
  title: 'AI Deck & Landscaping Demo',
  url: '/Demo-videos/Deck-Landscaping-demo.mp4'
}, {
  title: 'AI Roofing Demo',
  url: '/Demo-videos/Roofing-Demo.mp4'
}, {
  title: 'AI Pool Demo',
  url: '/Demo-videos/Pool-Demo.mp4'
}];
const DemoSection: React.FC = () => <section id="demo-calls" className="section-padding bg-background">
    <div className="container mx-auto">
      <h2 className="heading-lg text-center mb-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-voiceai-primary to-voiceai-secondary">
          SummitVoiceAI
        </span>
        {" Demo Calls"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {videos.map((vid, i) => <div key={i} className="flex flex-col items-center">
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <video src={vid.url} title={vid.title} controls preload="metadata" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-center font-medium">{vid.title}</p>
          </div>)}
      </div>
    </div>
  </section>;
export default DemoSection;
