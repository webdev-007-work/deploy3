import React from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { AlertOctagon, Info, ThumbsDown, Shield } from "lucide-react";

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

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <Header />

      {/* Hero */}
      <section className="w-full py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <AlertOctagon className="mx-auto mb-6 w-16 h-16 animate-pulse opacity-80" />
          <h1 className="text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl max-w-xl mx-auto opacity-90">
            Understand the limitations and responsibilities related to our
            content and services.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_white/10,_transparent)] pointer-events-none" />
      </section>

      {/* Sections */}
      <Section icon={Info} title="General Information">
        <p>
          All information on this site is provided in good faith, but we make no
          representation or warranty of any kind regarding accuracy, adequacy,
          validity, reliability, or completeness.
        </p>
      </Section>

      <Section icon={ThumbsDown} title="External Links" reverse bg="blue-50">
        <p>
          Our website may contain links to third-party sites. We do not control
          or endorse the content or policies of any external websites and are
          not responsible for them.
        </p>
      </Section>

      <Section icon={Shield} title="Limitation of Liability">
        <p>
          We are not liable for any losses or damages resulting from your use of
          this website or reliance on any content provided here.
        </p>
      </Section>

      <Section
        icon={AlertOctagon}
        title="Use at Your Own Risk"
        reverse
        bg="blue-50"
      >
        <p>
          You are solely responsible for how you use the information or services
          on this website. All usage is at your own risk.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: June 2025</p>
      </Section>

      <Footer />
    </div>
  );
}
