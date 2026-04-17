import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Users, Target, Shield, Lightbulb, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function AboutUs() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover:bg-card-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold neon-glow">About Business Therapist</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="text-5xl">🎯</div>
          <h2 className="text-4xl font-bold neon-glow">Your AI Business Coach</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Business Therapist is an empathetic, solution-focused AI coaching platform designed to help professionals navigate complex business challenges with confidence and clarity.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold neon-glow">Our Mission</h3>
            <p className="text-lg text-muted-foreground">
              We believe that every professional deserves access to high-quality coaching. Business Therapist combines cutting-edge AI with proven coaching methodologies to provide personalized, empathetic guidance whenever you need it.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're facing leadership challenges, strategic decisions, team conflicts, or personal professional growth, we're here to help you think through problems and find actionable solutions.
            </p>
          </div>
          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Empathetic</h4>
                  <p className="text-sm text-muted-foreground">We understand the challenges you face and respond with genuine care</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Solution-Focused</h4>
                  <p className="text-sm text-muted-foreground">We help you identify actionable steps and move forward</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Always Available</h4>
                  <p className="text-sm text-muted-foreground">24/7 coaching whenever inspiration or guidance strikes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-card/50 border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold neon-glow text-center mb-12">Why Choose Business Therapist?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">AI-Powered Insights</h4>
              <p className="text-muted-foreground">
                Leverage advanced AI trained on business coaching best practices to get personalized, contextual advice for your unique situation.
              </p>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Personalized Coaching</h4>
              <p className="text-muted-foreground">
                Every conversation is tailored to your goals, challenges, and communication style. Our AI learns from your sessions to provide better guidance over time.
              </p>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Confidential & Secure</h4>
              <p className="text-muted-foreground">
                Your conversations are private and secure. We never share your data with third parties. Your coaching journey is yours alone.
              </p>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Action-Oriented</h4>
              <p className="text-muted-foreground">
                We don't just listen—we help you identify concrete next steps and action items to move your business forward.
              </p>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Instant Access</h4>
              <p className="text-muted-foreground">
                No waiting for appointments. Get coaching whenever you need it—during a crisis, before a big decision, or for ongoing development.
              </p>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Supportive & Non-Judgmental</h4>
              <p className="text-muted-foreground">
                Share your challenges without fear. Our AI coach provides support, perspective, and practical wisdom in a safe, judgment-free space.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold neon-glow text-center mb-12">How Professionals Use Business Therapist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Leadership Challenges</h4>
            <p className="text-muted-foreground">
              Navigate team dynamics, manage difficult conversations, develop leadership skills, and build confidence in your role.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Strategic Decisions</h4>
            <p className="text-muted-foreground">
              Think through major business decisions, evaluate options, assess risks, and gain clarity on your strategic direction.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Career Development</h4>
            <p className="text-muted-foreground">
              Plan your career growth, prepare for promotions, develop new skills, and overcome professional obstacles.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Work-Life Balance</h4>
            <p className="text-muted-foreground">
              Find balance between ambition and wellbeing, manage stress, and create sustainable success in your career.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Team Dynamics</h4>
            <p className="text-muted-foreground">
              Resolve conflicts, improve communication, build stronger teams, and foster a positive workplace culture.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Personal Growth</h4>
            <p className="text-muted-foreground">
              Develop self-awareness, overcome limiting beliefs, build resilience, and unlock your full professional potential.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-3xl font-bold neon-glow">Ready to Transform Your Business Journey?</h3>
          <p className="text-lg text-muted-foreground">
            Start your first coaching session today and discover how Business Therapist can help you navigate challenges with confidence and clarity.
          </p>
          <Button
            onClick={() => navigate("/chat")}
            className="btn-neon px-8 py-6 text-lg"
          >
            Start Your Session
          </Button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-card/50 border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">Privacy First</h4>
              <p className="text-sm text-muted-foreground">
                Your conversations are encrypted and private. We never sell or share your data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Always Learning</h4>
              <p className="text-sm text-muted-foreground">
                Our AI continuously improves to provide better coaching and more relevant insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Built for You</h4>
              <p className="text-sm text-muted-foreground">
                We're committed to making professional coaching accessible to everyone.
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Business Therapist. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
