import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { GardenSeed } from '@/components/animations/GardenSeed';
import { SofiaFirefly } from '@/components/animations/SofiaFirefly';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  const handleGetStarted = () => {
    navigate('/sign-up');
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-green-200/50 dark:border-green-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <LegacyGuardLogo />
              <span className="text-2xl font-bold text-green-900 dark:text-green-100 font-heading">
                LegacyGuard
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  onClick={handleSignIn}
                  className="text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-100"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-green-900 dark:text-green-100 mb-6 leading-tight">
              Your Legacy, <span className="text-green-600">Secured</span>.
              <br />
              Your Family, <span className="text-emerald-600">Protected</span>.
            </h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-green-700 dark:text-green-200 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The most intuitive and caring way to organize your life's most important information 
              and ensure your family's peace of mind.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="sparkles" className="w-5 h-5 mr-2" />
                Start Your Journey for Free
              </Button>
            </motion.div>
          </motion.div>

          {/* Garden Visualization */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative max-w-2xl mx-auto">
              <GardenSeed 
                progress={75} 
                size="large" 
                showPulse={true}
              />
              <SofiaFirefly 
                isVisible={true}
                mode="empathetic"
              />
            </div>
            <p className="text-green-600 dark:text-green-400 mt-4 text-lg">
              Watch your Garden of Legacy grow with every milestone
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/60 dark:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 dark:text-green-100 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-green-700 dark:text-green-200 max-w-2xl mx-auto">
              Your journey to family security in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-4">
                  <motion.div 
                    className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon name="vault" className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Organize Your Present
                  </h3>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    Securely upload and manage all your vital documents with AI-powered assistance. 
                    Sofia guides you through every step with care and intelligence.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-4">
                  <motion.div 
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon name="shield" className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Protect Your Family
                  </h3>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    Build your Family Shield by appointing trusted guardians for any situation. 
                    Ensure your loved ones know exactly what to do and where to find help.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-4">
                  <motion.div 
                    className="w-20 h-20 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon name="legacy" className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Define Your Legacy
                  </h3>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    Create a legally sound will and leave personal messages that last forever. 
                    Your wisdom and love will guide your family for generations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why LegacyGuard Section */}
      <section className="py-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 dark:text-green-100 mb-6">
              Why Choose LegacyGuard?
            </h2>
            <p className="text-xl text-green-700 dark:text-green-200 max-w-2xl mx-auto">
              More than just document storage – it's peace of mind for your entire family
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Peace of Mind",
                description: "Sleep soundly knowing your affairs are in perfect order.",
                icon: "heart",
                color: "green"
              },
              {
                title: "Empathetic Guidance", 
                description: "Our AI assistant, Sofia, guides you with care, not complexity.",
                icon: "sparkles",
                color: "emerald"
              },
              {
                title: "Bank-Level Security",
                description: "Your data is protected with end-to-end encryption and zero-knowledge architecture.",
                icon: "shield-check",
                color: "teal"
              },
              {
                title: "A Lasting Gift",
                description: "Give your family the ultimate gift: clarity and security in difficult times.",
                icon: "legacy",
                color: "green"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="space-y-4">
                    <motion.div 
                      className={`w-16 h-16 bg-${benefit.color}-100 dark:bg-${benefit.color}-900 rounded-full flex items-center justify-center mx-auto`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon name={benefit.icon as any} className={`w-8 h-8 text-${benefit.color}-600 dark:text-${benefit.color}-400`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                      {benefit.title}
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white/60 dark:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 dark:text-green-100 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-green-700 dark:text-green-200 max-w-2xl mx-auto">
              Start free, upgrade when you're ready for advanced features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">Free</h3>
                    <div className="text-4xl font-bold text-green-600 mt-2">$0</div>
                    <p className="text-green-700 dark:text-green-300">Forever</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      "Up to 10 secure documents",
                      "Basic Sofia AI guidance",
                      "Simple will creation",
                      "1 trusted guardian",
                      "Email support"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Icon name="check" className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleGetStarted}
                  >
                    Start Free Today
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 hover:shadow-lg transition-all duration-300 relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600">
                  Most Popular
                </Badge>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">Premium</h3>
                    <div className="text-4xl font-bold text-emerald-600 mt-2">$9.99</div>
                    <p className="text-green-700 dark:text-green-300">per month</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      "Unlimited secure documents",
                      "Advanced Sofia AI with personalization",
                      "Professional will templates",
                      "Unlimited trusted guardians",
                      "Time capsule messages",
                      "Advanced legacy planning",
                      "Priority support",
                      "Legal document review"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Icon name="check" className="w-4 h-4 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleGetStarted}
                  >
                    Start Premium Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-green-900 dark:bg-green-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <LegacyGuardLogo />
                <span className="text-xl font-bold font-heading">LegacyGuard</span>
              </div>
              <p className="text-green-200 text-sm">
                Securing your legacy, protecting your family, one document at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">User Guides</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/security-policy" className="hover:text-white transition-colors">Security Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-200">
            <p>&copy; 2024 LegacyGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}