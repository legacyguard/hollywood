import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon-library";
import { toast } from 'sonner';

export default function LegacyPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call for email collection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you! We\'ll notify you when Legacy Planning is available.');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-card-border">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 text-center">
            <FadeIn duration={0.8} delay={0.2}>
              <div className="w-20 h-20 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="wishes" className="w-10 h-10 text-primary" />
              </div>
            </FadeIn>
            
            <FadeIn duration={0.8} delay={0.4}>
              <h1 className="text-4xl lg:text-5xl font-bold font-heading text-card-foreground mb-6">
                Legacy Planning
              </h1>
            </FadeIn>
            
            <FadeIn duration={0.8} delay={0.6}>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                The most personal part of your digital legacy. Create your will, record final wishes, 
                and leave heartfelt messages for those you love most.
              </p>
            </FadeIn>

            <FadeIn duration={0.8} delay={0.8}>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                <Icon name="sparkles" className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Coming Soon</span>
              </div>
            </FadeIn>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          {/* What's Coming */}
          <FadeIn duration={0.6} delay={1.0}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What's Coming to Legacy Planning</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're crafting tools that honor the profound nature of legacy planning with the care it deserves.
              </p>
            </div>
          </FadeIn>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FadeIn duration={0.6} delay={1.2}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Icon name="documents" className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Digital Will Creator</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Step-by-step guidance to create a comprehensive will with built-in legal templates 
                  and jurisdiction-specific requirements.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.4}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Icon name="video" className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Time Capsule Messages</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Record video messages, write letters, and create digital time capsules to be delivered 
                  on special occasions or milestones.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.6}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-300">
                  <Icon name="protection" className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Healthcare Directives</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Document your medical wishes, power of attorney preferences, and healthcare decisions 
                  with easy-to-update templates.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.8}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Icon name="financial" className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Asset Distribution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Organize and distribute your financial assets, personal belongings, and digital accounts 
                  with clear instructions for beneficiaries.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={2.0}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-rose-500/10 rounded-full flex items-center justify-center group-hover:bg-rose-500/20 transition-colors duration-300">
                  <Icon name="wishes" className="w-8 h-8 text-rose-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Final Wishes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Record your preferences for funeral arrangements, memorial services, and how you'd 
                  like to be remembered by those you love.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={2.2}>
              <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 mx-auto mb-6 bg-indigo-500/10 rounded-full flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-300">
                  <Icon name="users" className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Guardian Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seamlessly connect with your trusted guardians to ensure your legacy plans are 
                  accessible when they're needed most.
                </p>
              </Card>
            </FadeIn>
          </div>

          {/* Why It Matters Section */}
          <FadeIn duration={0.6} delay={2.4}>
            <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16">
              <div className="max-w-4xl mx-auto text-center">
                <Icon name="heart" className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-6">Why Legacy Planning Matters</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Legacy planning isn't just about legal documents—it's about peace of mind for you and clarity for your loved ones. 
                  It's ensuring your voice continues to guide and comfort those you care about, even when you can't be there in person.
                </p>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                  <div className="flex gap-4">
                    <Icon name="shield-check" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Peace of Mind</h4>
                      <p className="text-sm text-muted-foreground">Know that your wishes will be respected and your family will be cared for.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Icon name="heart" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Family Harmony</h4>
                      <p className="text-sm text-muted-foreground">Clear instructions prevent confusion and conflict during difficult times.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Icon name="clock" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Time to Connect</h4>
                      <p className="text-sm text-muted-foreground">Create meaningful messages that will comfort your loved ones for years to come.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Notify Me Section */}
          <FadeIn duration={0.6} delay={2.6}>
            <Card className="p-10 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Be the First to Know</h3>
              <p className="text-muted-foreground mb-8">
                Legacy Planning is coming soon. Enter your email to be notified the moment it becomes available, 
                plus receive our comprehensive guide to preparing your digital legacy.
              </p>
              
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="sr-only">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center"
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Icon name="mail" className="w-4 h-4 mr-2" />
                      Notify Me When Available
                    </>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </Card>
          </FadeIn>

          {/* Legal Disclaimer */}
          <FadeIn duration={0.6} delay={2.8}>
            <Card className="mt-12 p-6 bg-muted/30 border-muted">
              <div className="flex gap-3">
                <Icon name="info" className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Important Legal Notice</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    While LegacyGuard provides tools and templates to help organize your legacy planning, 
                    we strongly recommend consulting with qualified legal and financial professionals to ensure 
                    your documents meet all legal requirements in your jurisdiction and properly reflect your intentions.
                  </p>
                </div>
              </div>
            </Card>
          </FadeIn>
        </main>
      </div>
    </DashboardLayout>
  );
}
