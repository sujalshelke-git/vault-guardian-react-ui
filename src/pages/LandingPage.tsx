
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Shield, Lock, Key, RefreshCw } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <section className="py-12 md:py-24 lg:py-32 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Your passwords, <span className="secureVault-gradient">secured.</span>
                </h1>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto lg:mx-0">
                  SecureVault helps you store your passwords securely with military-grade encryption and access them from anywhere, on any device.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="secureVault-gradient-bg">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 mt-10 lg:mt-0">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="secureVault-glass rounded-2xl p-6 shadow-xl">
                    <div className="mb-4 text-2xl font-semibold">Password Vault</div>
                    <div className="space-y-4">
                      {[
                        { site: "Google", username: "user@example.com" },
                        { site: "Twitter", username: "secureuser" },
                        { site: "Banking App", username: "secure_banking" }
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white/50 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{item.site}</div>
                            <div className="text-sm text-foreground/70">{item.username}</div>
                          </div>
                          <div>
                            <div className="w-24 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full secureVault-gradient-bg flex items-center justify-center text-white">
                    <Lock className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need for password security
              </h2>
              <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
                SecureVault provides all the tools you need to keep your online accounts secure and easily accessible.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-10 w-10 text-vault-blue" />,
                  title: "Military-grade Encryption",
                  description: "Your data is encrypted with the highest standards before it leaves your device."
                },
                {
                  icon: <Key className="h-10 w-10 text-vault-teal" />,
                  title: "Securely Store Anything",
                  description: "Store passwords, notes, credit cards, and other sensitive information."
                },
                {
                  icon: <RefreshCw className="h-10 w-10 text-vault-blue" />,
                  title: "Auto-Fill & Sync",
                  description: "Access your passwords on any device with real-time synchronization."
                }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 secureVault-gradient-bg text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to secure your digital life?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SecureVault with their sensitive information.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary">
                Start for free
              </Button>
            </Link>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-xl font-bold secureVault-gradient">SecureVault</div>
            <div className="mt-2 text-foreground/70">
              © {new Date().getFullYear()} SecureVault. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
