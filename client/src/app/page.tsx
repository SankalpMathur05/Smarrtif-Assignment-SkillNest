import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            New Courses Available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Unlock Your Potential with <br className="hidden md:block" />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              SkillNest
            </span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover expert-led courses and workshops to upgrade your skills.
            Join thousands of students learning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-2 hover:bg-secondary/50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Diverse Courses</h3>
              <p className="text-muted-foreground">
                From coding to design, find the perfect course for your career goals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals with years of real-world experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certified Skills</h3>
              <p className="text-muted-foreground">
                Earn certificates upon completion to showcase your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-600 opacity-90" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-primary-foreground/90 text-xl max-w-2xl mx-auto mb-10">
                Join our community of learners and take the next step in your career today.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-primary font-bold text-lg px-8 h-14 rounded-full">
                  Join for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
