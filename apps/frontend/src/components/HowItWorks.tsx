
import { Button } from "./Button";

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-riverside-600 flex items-center justify-center text-white font-bold text-lg">
          {number}
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create Your Session",
      description: "Set up your podcast recording in seconds. Name your show, customize settings, and get ready to record."
    },
    {
      number: "2",
      title: "Invite Your Guests",
      description: "Share a simple link with up to 8 guests. They can join from any computer with a Chrome browser."
    },
    {
      number: "3",
      title: "Record in Sync",
      description: "Everyone records locally on their own device, ensuring the highest quality regardless of internet connection."
    },
    {
      number: "4",
      title: "Export & Share",
      description: "When you're done, Riverside automatically uploads all recordings and provides separate audio and video tracks."
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              How Riverside Works
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Record studio-quality podcasts with guests from anywhere in the world. Our progressive recording technology makes the process simple and reliable.
            </p>
            
            <div className="space-y-10">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
            
            <div className="mt-10">
              <Button className="bg-riverside-600 hover:bg-riverside-700 text-white">
                Start Recording Now
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="bg-gradient-radial from-riverside-100 to-transparent w-full h-full absolute -z-10 rounded-full opacity-70"></div>
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative">
                <div className="absolute inset-0 bg-gray-800 opacity-90 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-riverside-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  Watch demo
                </div>
              </div>
              
              {/* Interface elements positioned above the video */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100 w-48">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Recording in progress</span>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium">00:24:18</div>
                  <div className="h-4 w-4 bg-riverside-600 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-riverside-100 flex items-center justify-center">
                    <span className="text-riverside-600 font-medium">JD</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs text-gray-500">Host</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
