'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Trophy, Users, BarChart3, ArrowRight, Star, Shield, Clock, Globe, Heart, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/ui/header';

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: BookOpen,
      title: 'Reading Mastery',
      description: 'Interactive phonics, syllables, and word building exercises',
      color: 'bg-blue-500',
    },
    {
      icon: Brain,
      title: 'Attention Training',
      description: 'Memory games, pattern matching, and focus exercises',
      color: 'bg-purple-500',
    },
    {
      icon: Zap,
      title: 'Speed Reading',
      description: 'Word pyramids, Schulte tables, and comprehension training',
      color: 'bg-orange-500',
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Points, levels, achievements, and personalized avatars',
      color: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Family Dashboard',
      description: 'Track progress, set goals, and celebrate achievements',
      color: 'bg-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Detailed progress reports and learning insights',
      color: 'bg-indigo-500',
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Proven Results',
      description: 'Improve reading speed and comprehension by 20% in just 30 days',
      stat: '20%',
      statLabel: 'Improvement'
    },
    {
      icon: Users,
      title: 'Safe Learning',
      description: 'Child-safe environment with no ads, distractions, or inappropriate content',
      stat: '100%',
      statLabel: 'Safe'
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Learn at your own pace with sessions as short as 15 minutes',
      stat: '15min',
      statLabel: 'Sessions'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Support for multiple languages to enhance global learning',
      stat: '5+',
      statLabel: 'Languages'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Parent of 7-year-old',
      content: 'My daughter went from struggling with reading to loving books in just 3 weeks. The progress tracking helps me see exactly where she\'s improving.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael R.',
      role: 'Elementary Teacher',
      content: 'I recommend EduSpark to all my students\' parents. The attention training games have significantly improved classroom focus.',
      avatar: '👨‍🏫'
    },
    {
      name: 'Lisa K.',
      role: 'Parent of twins',
      content: 'Both my kids love the gamified approach. They compete with each other to earn more points, making learning fun and engaging.',
      avatar: '👩‍👧‍👦'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Children' },
    { number: '95%', label: 'Parent Satisfaction' },
    { number: '30+', label: 'Learning Activities' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        title="EduSpark" 
        showNavigation={false}
      >
        <div className="flex space-x-2">
          <Link href="/child-dashboard">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Demo
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Get Started
            </Button>
          </Link>
        </div>
      </Header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Where Learning
              <br />
              Becomes Adventure
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower children aged 3-10 with interactive, gamified learning experiences that develop
              reading, attention, and cognitive skills through play.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3">
                  Start Learning Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button size="lg" variant="outline" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Learning Platform
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scientifically designed activities that adapt to your child's learning pace and style
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center transform transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Why Parents Choose EduSpark
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of families worldwide for proven educational results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                    <div className="text-sm text-gray-500 mb-4">{benefit.statLabel}</div>
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              What Families Are Saying
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from parents and educators who've seen amazing results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              How EduSpark Works
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your child's learning experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Assessment & Setup',
                description: 'Quick diagnostic to understand your child\'s current level and learning style',
                icon: Brain
              },
              {
                step: '2',
                title: 'Personalized Learning',
                description: 'AI-powered curriculum adapts to your child\'s pace and interests',
                icon: Heart
              },
              {
                step: '3',
                title: 'Track Progress',
                description: 'Monitor improvements with detailed analytics and celebrate achievements',
                icon: Award
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h3 className="text-4xl font-bold mb-4">
              Ready to Start the Adventure?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of families already using EduSpark to unlock their child's potential
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                Begin Learning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Image 
                src="/eduspark-logo.png" 
                alt="EduSpark Logo" 
                width={20} 
                height={20} 
                className="object-contain"
              />

            </div>
            <h4 className="text-xl font-bold">EduSpark</h4>
          </div>
          <p className="text-gray-400">
            Empowering young minds through interactive learning experiences
          </p>
        </div>
      </footer>
    </div>
  );
}