import React from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { CheckCircle, Info, HelpCircle } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useNavigate } from "react-router-dom";

const services = [
  {
    name: "Netflix",
    link: "https://netflix.com/activate",
    steps: [
      "Open the Netflix app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Netflix account.",
      "Enter the activation code and click 'Activate'.",
    ],
  },
  {
    name: "YouTube",
    link: "https://youtube.com/activate",
    steps: [
      "Open the YouTube app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Google account.",
      "Enter the activation code and click 'Allow Access'.",
    ],
  },
  {
    name: "Amazon Prime Video",
    link: "https://amazon.com/mytv",
    steps: [
      "Open the Prime Video app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Amazon account.",
      "Enter the activation code and click 'Register Device'.",
    ],
  },
  {
    name: "Disney+",
    link: "https://disneyplus.com/begin",
    steps: [
      "Open the Disney+ app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Disney+ account.",
      "Enter the activation code and click 'Activate'.",
    ],
  },
  {
    name: "Hulu",
    link: "https://hulu.com/activate",
    steps: [
      "Open the Hulu app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Hulu account.",
      "Enter the activation code and click 'Activate'.",
    ],
  },
  {
    name: "HBO Max",
    link: "https://hbomax.com/activate",
    steps: [
      "Open the HBO Max app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your HBO Max account.",
      "Enter the activation code and click 'Submit'.",
    ],
  },
  {
    name: "Peacock",
    link: "https://peacocktv.com/activate",
    steps: [
      "Open the Peacock app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Peacock account.",
      "Enter the activation code and click 'Activate'.",
    ],
  },
  {
    name: "Paramount+",
    link: "https://paramountplus.com/activate",
    steps: [
      "Open the Paramount+ app on your TV.",
      "An activation code will appear.",
      "Visit the activation link on your browser.",
      "Log in to your Paramount+ account.",
      "Enter the activation code and click 'Activate'.",
    ],
  },
];

const faqs = [
  {
    q: "Do you collect activation codes?",
    a: "No, we do not collect or store activation codes. This page is strictly for educational purposes.",
  },
  {
    q: "Are you affiliated with streaming service providers?",
    a: "No, we are not affiliated with Netflix, YouTube, Hulu, Amazon, Disney+, HBO Max, Peacock, or Paramount+.",
  },
  {
    q: "How do I activate streaming services on my TV?",
    a: "Follow the on-screen instructions on your TV, obtain the activation code, and visit the official activation link provided by the streaming service.",
  },
];

export default function ComMyTV() {
  const { settings } = useSiteSettings();
  const callNowNumber = settings?.brand_phone || "+1 (888) 970-1698";
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4 || code.length > 8) {
      setError("Code must be 4-8 characters.");
      return;
    }
    setError("");
    navigate("/activate");
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero/Intro */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Streaming Service Activation Guide
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Step-by-step instructions for activating your favorite streaming
              services on your smart TV or device. <br />{" "}
            </p>
            {/* Activation Code Input */}
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto flex flex-col items-center gap-4 mt-8"
              autoComplete="off"
            >
              <label
                className="text-lg font-semibold text-gray-800 mb-1"
                htmlFor="activation-code"
              >
                Enter Your Activation Code
              </label>

              <input
                id="activation-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code (4-8 characters)"
                className="w-full max-w-lg px-6 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 bg-white shadow"
                maxLength={8}
                minLength={4}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full max-w-lg py-3 px-6 bg-black text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition text-lg mt-2"
              >
                Submit
              </button>
            </form>
            {/* Call Now Button */}
            <a
              href={`tel:${callNowNumber}`}
              className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Call Now {callNowNumber}
            </a>
          </div>
        </section>

        {/* General Activation Instructions */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" /> General Activation
              Instructions
            </h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 text-lg">
              <li>
                Power on your smart TV or streaming device and connect to the
                internet.
              </li>
              <li>
                Open the streaming service app (e.g., Netflix, YouTube, Hulu).
              </li>
              <li>A unique activation code will appear on your TV screen.</li>
              <li>
                Visit the official activation page of the streaming service on
                your phone or computer.
              </li>
              <li>
                Enter the activation code and log in to complete the activation
                process.
              </li>
            </ol>
            {/* Call Now Button in Instructions */}
            <div className="flex justify-center mt-8">
              <a
                href={`tel:${callNowNumber}`}
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Call Now {callNowNumber}
              </a>
            </div>
          </div>
        </section>

        {/* Step-by-Step for Popular Services */}
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Step-by-Step Activation for Popular Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-indigo-700">
                      {service.name}
                    </span>
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline text-sm"
                    >
                      Official Link
                    </a>
                  </div>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-1 text-base">
                    {service.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center gap-2 justify-center">
              <HelpCircle className="w-6 h-6 text-indigo-500" /> Frequently
              Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-700 text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm">
              <b>Disclaimer:</b> This website does not promote unauthorized
              access. We are not affiliated with any streaming service
              providers. All trademarks, logos, and brand names belong to their
              respective owners.
              <br />
              <br />
              This page is an independent educational resource. We do not
              process, collect, or store activation codes.
            </p>
          </div>
        </section>
      </main>
      
    </div>
  );
}
