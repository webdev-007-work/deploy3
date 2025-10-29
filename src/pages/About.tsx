import React, { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import {
  Sparkles,
  Users,
  Brain,
  Heart,
  Target,
  BookOpen,
  Award,
  Mail,
} from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description:
        "Visionary leader with 10+ years in AI and content creation.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Tech innovator specializing in AI-powered platforms.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Creative director passionate about user experience.",
    },
    {
      name: "David Kumar",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Full-stack engineer building scalable solutions.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "We pour our hearts into everything we create, ensuring every detail reflects our commitment to excellence.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building meaningful connections and fostering collaboration among creators worldwide.",
    },
    {
      icon: Brain,
      title: "Innovation",
      description:
        "Constantly pushing boundaries to deliver cutting-edge solutions that inspire and empower.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "Maintaining the highest standards in everything we do, from product development to user support.",
    },
  ];

  // Dynamic site info
  const brandEmail = settings?.brand_email || "support@onassist.com";
  const brandPhone = settings?.brand_phone || "+1 (888) 970-1698";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About Us
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're a passionate team dedicated to empowering creativity through
              the perfect blend of human imagination and artificial
              intelligence.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-6">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2021, our journey began with a simple belief: that
                  technology should amplify human creativity, not replace it. We
                  started as a small team of dreamers and builders who saw the
                  incredible potential in combining AI with human insight.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, we've grown into a platform that serves thousands of
                  creators worldwide, helping them bring their ideas to life in
                  ways they never thought possible. Our story is still being
                  written, and we're excited to have you be part of it.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Team collaboration and brainstorming session"
                  className="aspect-video w-full object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-6">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                To democratize creativity by providing tools that make advanced
                AI accessible to everyone, empowering individuals and businesses
                to tell their stories in compelling and meaningful ways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-6">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Behind every great product is an even greater team. Meet the
                passionate individuals who make our vision a reality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Numbers that reflect our commitment to empowering creators
                worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  50K+
                </div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  1M+
                </div>
                <div className="text-gray-600">Content Created</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  150+
                </div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have questions about our mission or want to join our team? We'd
              love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Contact Us
              </button>
              <button className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300">
                Join Our Team
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
