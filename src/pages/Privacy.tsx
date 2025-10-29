import React from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ShieldCheck, Lock, UserCheck, Info, Mail } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Section = ({
  icon: Icon,
  title,
  children,
  reverse = false,
  bg = "white",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
  bg?: string;
}) => (
  <section className={`w-full py-16 bg-${bg}`}>
    <div
      className={`container mx-auto px-4 flex flex-col md:flex-row items-center gap-10 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <Icon className="w-24 h-24 text-indigo-300 shrink-0" />
      <div className="flex-1">
        <h2 className="text-3xl font-semibold text-indigo-800 mb-4">{title}</h2>
        <div className="text-gray-700 text-lg">{children}</div>
      </div>
    </div>
  </section>
);

export default function Privacy() {
  const { settings } = useSiteSettings();
  const brandEmail = settings?.brand_email || "support@onassist.com";
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <Header />

      {/* Hero */}
      <section className="w-full py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <ShieldCheck className="mx-auto mb-6 w-16 h-16 animate-pulse opacity-80" />
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-xl mx-auto opacity-90">
            Learn how we collect, use, and protect your personal data.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_white/10,_transparent)] pointer-events-none" />
      </section>

      {/* Sections */}
      <Section icon={Info} title="What We Collect">
        <ul className="list-disc list-inside space-y-2">
          <li>Personal info you provide (name, email, etc.)</li>
          <li>Usage data and analytics</li>
          <li>Cookies and related technologies</li>
        </ul>
      </Section>

      <Section icon={Lock} title="How We Use Your Data" reverse bg="blue-50">
        <ul className="list-disc list-inside space-y-2">
          <li>To provide and enhance our services</li>
          <li>To communicate with you effectively</li>
          <li>To personalize your experience</li>
          <li>To ensure security and prevent misuse</li>
        </ul>
      </Section>

      <Section icon={UserCheck} title="Your Rights">
        <ul className="list-disc list-inside space-y-2">
          <li>Request access, correction, or deletion of your data</li>
          <li>Opt-out of marketing communication</li>
        </ul>
      </Section>

      <Section icon={ShieldCheck} title="Security" reverse bg="blue-50">
        <p>
          We implement industry-standard practices to keep your information safe
          and secure. Protecting your privacy is our highest priority.
        </p>
      </Section>

      <Section icon={Mail} title="Contact Us">
        <p>
          For privacy-related questions, reach out at{" "}
          <a
            href={`mailto:${brandEmail}`}
            className="text-blue-600 hover:underline"
          >
            {brandEmail}
          </a>
          .
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: June 2025</p>
      </Section>

      <Footer />
    </div>
  );
}
