import React from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { FileText, AlertTriangle, ThumbsUp, Lock } from "lucide-react";

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

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <Header />

      {/* Hero */}
      <section className="w-full py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <FileText className="mx-auto mb-6 w-16 h-16 animate-pulse opacity-80" />
          <h1 className="text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl max-w-xl mx-auto opacity-90">
            Please read our terms carefully before using our services.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_white/10,_transparent)] pointer-events-none" />
      </section>

      {/* Sections */}
      <Section icon={ThumbsUp} title="Acceptance of Terms">
        <p>
          By accessing or using our services, you agree to be bound by these
          Terms & Conditions. If you disagree with any part, you may not access
          the service.
        </p>
      </Section>

      <Section icon={Lock} title="User Responsibilities" reverse bg="blue-50">
        <ul className="list-disc list-inside space-y-2">
          <li>Keep your account credentials secure</li>
          <li>Use the service lawfully and respectfully</li>
          <li>Do not misuse, hack, or disrupt our services</li>
        </ul>
      </Section>

      <Section icon={AlertTriangle} title="Limitations of Liability">
        <p>
          We are not liable for any indirect or consequential losses. Our
          platform is provided "as-is" without warranties of any kind.
        </p>
      </Section>

      <Section
        icon={FileText}
        title="Modifications to Terms"
        reverse
        bg="blue-50"
      >
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the service constitutes acceptance of the updated terms.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: June 2025</p>
      </Section>

      <Footer />
    </div>
  );
}
