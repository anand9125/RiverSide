
const TestimonialCard = ({ quote, author, title, image }: { quote: string, author: string, title: string, image: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.33333 20H4L8 12H6.66667C5.95942 12 5.28115 12.2811 4.78105 12.7812C4.28095 13.2813 4 13.9594 4 14.6667V16H2.66667V14.6667C2.66667 13.6058 3.08809 12.5884 3.83824 11.8383C4.58839 11.0881 5.6058 10.6667 6.66667 10.6667H12L9.33333 20ZM20 20H14.6667L18.6667 12H17.3333C16.6261 12 15.9478 12.2811 15.4477 12.7812C14.9476 13.2813 14.6667 13.9594 14.6667 14.6667V16H13.3333V14.6667C13.3333 13.6058 13.7548 12.5884 14.5049 11.8383C15.255 11.0881 16.2725 10.6667 17.3333 10.6667H22.6667L20 20Z" fill="#0C8EE6"/>
        </svg>
      </div>
      <p className="text-gray-700 mb-6 flex-grow">{quote}</p>
      <div className="flex items-center mt-4">
        <img src={image} alt={author} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <div className="font-bold text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The quality from Riverside is just unbeatable. I've tried multiple remote recording platforms, and nothing comes close to the professional output I get here.",
      author: "Sarah Johnson",
      title: "Host, Tech Insider Podcast",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "Our production workflow improved dramatically after switching to Riverside. The separate tracks feature alone has saved us countless hours in post-production.",
      author: "Michael Rodriguez",
      title: "Producer, Daily Business Show",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "I interview guests all over the world, often in places with spotty internet. Riverside's local recording feature has literally saved dozens of episodes from being ruined.",
      author: "Priya Patel",
      title: "Creator, Global Voices",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-riverside-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Podcast Professionals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of podcasters who trust Riverside to deliver professional-quality recordings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              title={testimonial.title}
              image={testimonial.image}
            />
          ))}
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 grayscale opacity-60">
          <div className="text-2xl font-bold">SPOTIFY</div>
          <div className="text-2xl font-bold">NPR</div>
          <div className="text-2xl font-bold">HBO</div>
          <div className="text-2xl font-bold">GIMLET</div>
          <div className="text-2xl font-bold">WONDERY</div>
          <div className="text-2xl font-bold">STITCHER</div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
