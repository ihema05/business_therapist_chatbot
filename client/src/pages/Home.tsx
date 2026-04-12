import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, Brain, MessageSquare, Zap } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/chat" as any);
    } else {
      const loginUrl = getLoginUrl();
      if (loginUrl) window.location.href = loginUrl;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold neon-glow">Business Therapist</span>
          </div>
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/chat" as any)}
              className="btn-neon"
            >
              Go to Chat
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container max-w-4xl mx-auto text-center space-y-8">
          {/* Main headline with neon glow */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black neon-glow text-balance leading-tight">
            Your AI Business Therapist
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Navigate complex business challenges with empathetic, solution-focused coaching. 
            Get actionable insights, build resilience, and transform your professional journey.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={handleGetStarted}
              className="btn-neon text-lg px-8 py-4 h-auto group"
            >
              Start Your Session
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4">Trusted by professionals worldwide</p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Confidential</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Instant</div>
                <div className="text-sm text-muted-foreground">Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 neon-glow">
            Why Business Therapist?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Empathetic Coaching</h3>
              </div>
              <p className="text-muted-foreground">
                Experience therapy-grade listening combined with practical business expertise. 
                We validate your concerns while guiding you toward actionable solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Persistent Sessions</h3>
              </div>
              <p className="text-muted-foreground">
                All your conversations are saved and organized. Return anytime to revisit 
                past insights or continue working through ongoing challenges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Actionable Insights</h3>
              </div>
              <p className="text-muted-foreground">
                Every session generates a summary with concrete action items. 
                Get a clear roadmap for moving forward with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 neon-glow">
            How It Works
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  1
                </div>
              </div>
              <div className="accent-line-cyan">
                <h3 className="text-xl font-bold mb-2">Start a Session</h3>
                <p className="text-muted-foreground">
                  Create a new conversation and share what's on your mind. 
                  Whether it's team conflict, strategic decisions, or personal growth, we're here to listen.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  2
                </div>
              </div>
              <div className="accent-line-cyan">
                <h3 className="text-xl font-bold mb-2">Receive Coaching</h3>
                <p className="text-muted-foreground">
                  Get empathetic, solution-focused responses that help you explore your challenges 
                  from new angles and identify practical next steps.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  3
                </div>
              </div>
              <div className="accent-line-cyan">
                <h3 className="text-xl font-bold mb-2">Get Your Summary</h3>
                <p className="text-muted-foreground">
                  When you're ready, generate a summary of your session with key action items. 
                  Receive it via email for future reference and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="container max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold neon-glow">
            Ready to Transform Your Business Journey?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join professionals who are navigating challenges with clarity, confidence, and support.
          </p>
          <Button
            onClick={handleGetStarted}
            className="btn-neon text-lg px-8 py-4 h-auto group"
          >
            Start Your First Session
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2026 Business Therapist. All sessions are confidential.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
