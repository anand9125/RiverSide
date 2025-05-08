
import { Check } from "lucide-react";
import { Button } from "./Button";

const PlanFeature = ({ feature }: { feature: string }) => (
  <div className="flex items-center py-2">
    <Check className="h-5 w-5 text-riverside-500 mr-3 flex-shrink-0" />
    <span className="text-gray-600">{feature}</span>
  </div>
);

const PricingCard = ({ 
  name, 
  price, 
  description, 
  features, 
  popular = false,
  buttonText = "Get Started" 
}: { 
  name: string, 
  price: string, 
  description: string, 
  features: string[], 
  popular?: boolean,
  buttonText?: string 
}) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden ${popular ? 'ring-2 ring-riverside-600 shadow-lg' : 'border border-gray-200 shadow-sm'}`}>
      {popular && (
        <div className="bg-riverside-600 py-1.5 px-4 text-white text-center text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">{price}</span>
          {price !== "Free" && <span className="ml-1 text-gray-500">/month</span>}
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
        
        <div className="mt-6">
          <Button 
            className={`w-full ${popular 
              ? 'bg-riverside-600 hover:bg-riverside-700 text-white' 
              : 'bg-white border-2 border-riverside-600 text-riverside-600 hover:bg-riverside-50'}`}
          >
            {buttonText}
          </Button>
        </div>
        
        <div className="mt-8 space-y-2">
          {features.map((feature, index) => (
            <PlanFeature key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Great for trying out Riverside",
      features: [
        "30-minute recordings",
        "720p video quality",
        "5 hours of cloud storage",
        "2 participants",
        "Basic editing tools"
      ],
      buttonText: "Sign Up Free"
    },
    {
      name: "Standard",
      price: "$19",
      description: "Professional podcasting essentials",
      features: [
        "2 hours of recording time",
        "Full HD video (1080p)",
        "15 hours of cloud storage",
        "Up to 4 participants",
        "Separate audio tracks",
        "Progressive uploads",
        "Advanced editing tools"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "$39",
      description: "For high-volume podcasters",
      features: [
        "Unlimited recording time",
        "4K video quality",
        "100 hours of cloud storage",
        "Up to 8 participants",
        "Producer mode",
        "Custom branding",
        "Advanced analytics",
        "Priority support"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your podcasting needs. All plans include our core high-quality recording technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              buttonText={plan.buttonText}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need a custom plan for your network or enterprise? <a href="#" className="text-riverside-600 font-medium hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
