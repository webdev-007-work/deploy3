import React, { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  HelpCircle,
  Send,
  Clock,
  Users,
  Globe,
} from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const faqs = [
  {
    q: "How soon will I get a response?",
    a: "We aim to reply to all inquiries within 24 hours on business days.",
    icon: Clock,
  },
  {
    q: "Can I collaborate or guest post?",
    a: "Absolutely! We welcome collaborations and guest contributions. Reach out with your ideas.",
    icon: Users,
  },
  {
    q: "Where are you based?",
    a: "We are a remote-first team with contributors from around the world.",
    icon: Globe,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { settings } = useSiteSettings();
  const brandEmail = settings?.brand_email || "support@onassist.com";
  const brandPhone = settings?.brand_phone || "+1 (888) 970-1698";

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  // Dynamic contact methods
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: brandEmail,
      link: `mailto:${brandEmail}`,
      color: "blue",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team directly",
      contact: brandPhone,
      link: `tel:${brandPhone.replace(/[^+\d]/g, "")}`,
      color: "green",
    },
    {
      icon: MapPin,
      title: "Our Location",
      description: "Remote-first, global team",
      contact: "Worldwide 🌍",
      link: "#",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have a question, feedback, or want to collaborate? We'd love to
              hear from you and will get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-${method.color}-100 rounded-lg mb-4`}
                  >
                    <method.icon
                      className={`w-6 h-6 text-${method.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <a
                    href={method.link}
                    className={`text-${method.color}-600 font-medium hover:text-${method.color}-700 transition-colors duration-300`}
                  >
                    {method.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Send us a message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Why reach out to us?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Quick Response
                        </h4>
                        <p className="text-gray-600">
                          We respond to all inquiries within 24 hours on
                          business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Expert Support
                        </h4>
                        <p className="text-gray-600">
                          Our team of experts is ready to help with any
                          questions or challenges.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Collaboration Opportunities
                        </h4>
                        <p className="text-gray-600">
                          Interested in partnerships or guest contributions?
                          We'd love to explore possibilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    Need immediate assistance?
                  </h4>
                  <p className="text-gray-600 mb-4">
                    For urgent matters, don't hesitate to give us a call. We're
                    here to help!
                  </p>
                  <a
                    href={`tel:${brandPhone.replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now {brandPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Illustration */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop"
              alt="Team collaboration and communication"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg mb-8"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              We're here to help you succeed
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our global team is passionate about supporting our community and
              helping you achieve your goals. Every message matters to us, and
              we're committed to providing you with the best possible support.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-6">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to common questions. Can't find what you're
                looking for? Feel free to contact us directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <faq.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
