
import { Headphones } from "lucide-react";
import { Button } from "./Button";

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} className="text-gray-500 hover:text-riverside-600 transition-colors">
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Headphones className="h-6 w-6 text-riverside-600 mr-2" />
              <span className="font-bold text-gray-900 text-lg">Riverside</span>
            </div>
            <p className="text-gray-600 mb-4">
              Professional podcast recording platform for creators who value quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-riverside-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-riverside-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.466 19.59c-.405.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.312-1.588-.823-2.147.082-.202.356-1.016-.079-2.117 0 0-.671-.215-2.198.82-.64-.18-1.324-.267-2.004-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-riverside-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.676 0h-21.352c-.731 0-1.324.593-1.324 1.324v21.352c0 .731.593 1.324 1.324 1.324h21.352c.731 0 1.324-.593 1.324-1.324v-21.352c0-.731-.593-1.324-1.324-1.324zm-11.676 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm8-12c-.737 0-1.333-.597-1.333-1.333s.596-1.333 1.333-1.333 1.333.597 1.333 1.333-.596 1.333-1.333 1.333z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><FooterLink href="#">Features</FooterLink></li>
              <li><FooterLink href="#">Pricing</FooterLink></li>
              <li><FooterLink href="#">Tutorials</FooterLink></li>
              <li><FooterLink href="#">Changelog</FooterLink></li>
              <li><FooterLink href="#">Status</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Help Center</FooterLink></li>
              <li><FooterLink href="#">Community</FooterLink></li>
              <li><FooterLink href="#">Podcast Studio</FooterLink></li>
              <li><FooterLink href="#">Recording Tips</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><FooterLink href="#">About</FooterLink></li>
              <li><FooterLink href="#">Careers</FooterLink></li>
              <li><FooterLink href="#">Contact</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Riverside. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Cookies</FooterLink>
          </div>
        </div>
      </div>
      
      <div className="bg-riverside-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Record Your Professional Podcast?</h2>
          <p className="text-riverside-100 mb-8 max-w-2xl mx-auto">
            Join thousands of podcasters who trust Riverside for studio-quality recordings, every time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white hover:bg-gray-100 text-riverside-600 px-8 py-6 text-lg">
              Start Recording Free
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-riverside-700 px-8 py-6 text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
