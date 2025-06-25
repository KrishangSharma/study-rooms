import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/magicui/marquee';
import { ReviewCard } from '@/components/core/ReviewCard';
import { AuroraText } from '@/components/magicui/aurora-text';
import {
  Users,
  Zap,
  Target,
  ArrowRight,
  Play,
  Clock,
  Rocket,
  Brain,
  Sparkles,
  Bot,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { AI_FEATURES, FeatureItems, PRODUCTIVITY_TOOLS, PRODUCTIVITY_TOOLS_TWO } from '@/constants';

export default function HomePage() {
  return (
    <div className="w-screen min-h-screen ">
      <main className="max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Elements */}

          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Animated Badge */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur opacity-75 animate-gradient-x"></div>
                  <Badge
                    variant="outline"
                    className="relative bg-background/80 backdrop-blur-sm border-0 px-6 py-2 text-sm font-medium rounded-full"
                  >
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Virtual Productivity Ecosystem
                  </Badge>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <AuroraText speed={1.5} className="mb-3 ">
                    Study Together,
                  </AuroraText>
                  <br />
                  <span className="text-foreground">Achieve More</span>
                </h1>

                {/* Description */}
                <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join virtual study rooms, stay accountable with AI-powered tools, and build
                  productive habits with a community that keeps you motivated.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Virtual Study Rooms</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-primary" />
                  <span>AI-Powered Accountability</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Gamified Progress</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Start Studying Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-background/50 backdrop-blur-sm border-2 hover:bg-muted/50 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 group"
                >
                  Watch Demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="relative py-20 lg:py-32">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              <Target className="w-5 h-5 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Everything you need to
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {' '}
                stay focused
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to enhance your productivity and keep you motivated in your
              study journey.
            </p>
          </div>

          <BentoGrid className="md:auto-rows-[20rem] px-3 sm:px-0">
            {FeatureItems.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                className={cn('[&>p:text-lg]', item.className)}
                icon={item.icon}
              />
            ))}
          </BentoGrid>
        </section>
        {/* Productivity Tools */}
        <section className="relative py-20 lg:py-32">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              <Clock className="w-4 h-4 mr-2" />
              Productivity Suite
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Tools that&nbsp;
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                supercharge
              </span>
              <br />
              your productivity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From Pomodoro timers to AI-powered analytics, discover the comprehensive toolkit
              designed to maximize your focus and track your progress.
            </p>
          </div>

          {/* Marquee Section */}
          <section className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="hidden sm:block absolute left-0 h-full bg-gradient-to-r from-white dark:from-[#0A0A0A] to-transparent w-[250px] z-20 " />
            <div className="hidden sm:block absolute right-0 h-full bg-gradient-to-l from-white dark:from-[#0A0A0A] to-transparent w-[250px] z-20 " />

            <Marquee pauseOnHover className="[--duration:35s]">
              {PRODUCTIVITY_TOOLS.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:35s]">
              {PRODUCTIVITY_TOOLS_TWO.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </Marquee>
          </section>
        </section>
        {/* AI Assistant Highlight */}
        <section className="relative py-20 lg:py-32">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Learning
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Your personal
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {' '}
                AI study companion
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of learning with our advanced AI assistant that understands your
              needs and adapts to your learning style.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center px-3 sm:px-0">
            {/* Left Side - Accordion */}
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {AI_FEATURES.map((feature, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-border rounded-xl px-6 bg-background/50 backdrop-blur-sm hover:bg-muted/80 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 cursor-pointer">
                      <span className="text-base font-semibold">{feature.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                      {feature.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

              {/* Main Visual Container */}
              <div className="relative bg-gradient-to-br from-background via-background/95 to-muted/50 rounded-3xl border border-border/50 p-8 backdrop-blur-sm">
                {/* Chat Interface Mockup */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Study Assistant</h3>
                      <p className="text-sm text-muted-foreground">Always ready to help</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                        <p className="text-sm">Can you help me understand calculus derivatives?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-muted">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                        <p className="text-sm">
                          Derivatives measure how a function changes as its input changes. Think of
                          it as the slope of a curve at any point...
                        </p>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-100"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-200"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="w-3 h-3 text-primary" />
                        <span>Instant Responses</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3 text-primary" />
                        <span>Personalized</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Brain className="w-3 h-3 text-primary" />
                        <span>Context Aware</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Final CTA Banner */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-12 items-center px-3 sm:px-0">
            {/* Left Side - Content */}
            <div className="space-y-8 col-span-2">
              {/* Badge */}
              <div className="flex justify-start">
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm border-primary/20"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Ready to Transform Your Study Habits?
                </Badge>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-left">
                  <span className="bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                    Start your productive
                  </span>
                  <br />
                  <span className="text-foreground">study journey today</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-left">
                  Join thousands of students, freelancers, and professionals who have transformed
                  their productivity with our virtual study ecosystem.
                </p>
              </div>

              {/* Stats */}
              <div className="flex sm:flex-row justify-start items-start sm:items-center gap-8">
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">Free</div>
                  <div className="text-xs text-muted-foreground">to get started</div>
                </div>
                <div className=" sm:block w-px h-8 bg-border"></div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">2 min</div>
                  <div className="text-xs text-muted-foreground">setup time</div>
                </div>
                <div className=" sm:block w-px h-8 bg-border"></div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground">AI support</div>
                </div>
              </div>

              {/* Mobile CTA Button */}
              <div className="lg:hidden flex justify-center pt-4">
                <div className="relative">
                  <button className="relative w-32 h-32 bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 rounded-full">
                      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                        <defs>
                          <path
                            id="circle-path-mobile"
                            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                          />
                        </defs>
                        <text className="text-[8px] fill-primary-foreground font-semibold tracking-widest">
                          <textPath href="#circle-path-mobile" startOffset="0%">
                            GET STARTED • GET STARTED • GET STARTED •
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Circular CTA Button (Desktop) */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <button className="relative w-48 h-48 bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary-foreground group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                      <defs>
                        <path
                          id="circle-path"
                          d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                        />
                      </defs>
                      <text className="text-[6px] fill-primary-foreground font-semibold tracking-wider ">
                        <textPath href="#circle-path" startOffset="0%">
                          GET STARTED • GET STARTED • GET STARTED • GET STARTED • GET STARTED •
                        </textPath>
                      </text>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
