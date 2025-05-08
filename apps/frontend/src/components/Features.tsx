
import { Mic, Headphones, Share, Download, Volume2, MessageSquare } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-riverside-100 flex items-center justify-center text-riverside-600 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Mic,
      title: "Studio-Quality Recording",
      description: "Capture pristine audio up to 48kHz WAV, regardless of your internet connection."
    },
    {
      icon: Headphones,
      title: "Separate Audio Tracks",
      description: "Get individual audio tracks for each participant for maximum editing flexibility."
    },
    {
      icon: Share,
      title: "Browser-Based",
      description: "No downloads required. Just send a link and start recording in seconds."
    },
    {
      icon: Download,
      title: "Local Recording Backup",
      description: "Files are recorded locally first, eliminating quality loss from poor connections."
    },
    {
      icon: Volume2,
      title: "Audio Processing",
      description: "Built-in noise cancellation, echo reduction, and audio leveling."
    },
    {
      icon: MessageSquare,
      title: "Producer Chat",
      description: "Behind-the-scenes communication channel for producers and hosts."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Podcasters Choose Riverside</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional tools designed for creators who demand the highest quality recording experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
