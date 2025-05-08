
import { Button } from "./Button";
import { Mic, Play, Volume2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-white to-riverside-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Record Studio-Quality{" "}
              <span className="text-riverside-600">Podcasts</span> from Anywhere
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Professional recording studio in your browser. Capture high-quality audio and video regardless of your internet connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-riverside-600 hover:bg-riverside-700 text-white px-8 py-6 text-lg">
                Start Recording Now
              </Button>
              <Button variant="outline" className="text-riverside-600 border-riverside-600 hover:bg-riverside-50 px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </Button>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Trusted by top podcasters worldwide</p>
              <div className="flex flex-wrap gap-6">
                <div className="text-gray-400 font-bold">SPOTIFY</div>
                <div className="text-gray-400 font-bold">NPR</div>
                <div className="text-gray-400 font-bold">HBO</div>
                <div className="text-gray-400 font-bold">GIMLET</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float">
              <div className="bg-riverside-800 rounded-xl p-6 flex flex-col items-center">
                <div className="w-full mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-white text-sm">Recording</span>
                    </div>
                    <span className="text-white text-sm">00:42:18</span>
                  </div>
                </div>

                <div className="w-full bg-riverside-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-riverside-500 mr-3"></div>
                    <span className="text-white text-sm">Host</span>
                  </div>
                  <div className="h-16 w-full relative">
                    <div className="flex items-end justify-between h-full pb-2 space-x-1">
                      {[...Array(40)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 bg-riverside-400 rounded-full animate-wave-${(i % 5) + 1}`}
                          style={{ 
                            height: `${Math.max(15, Math.sin(i * 0.2) * 50 + 50)}%`,
                            animationDelay: `${i * 0.05}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-riverside-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-white text-sm">Guest</span>
                  </div>
                  <div className="h-16 w-full relative">
                    <div className="flex items-end justify-between h-full pb-2 space-x-1">
                      {[...Array(40)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 bg-purple-400 rounded-full animate-wave-${(i % 5) + 1}`}
                          style={{ 
                            height: `${Math.max(5, Math.cos(i * 0.3) * 40 + 30)}%`,
                            animationDelay: `${i * 0.05 + 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-riverside-600 text-white">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-riverside-600 text-white">
                    <Volume2 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 right-1/2 w-[500px] h-[500px] bg-riverside-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -z-10 bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
