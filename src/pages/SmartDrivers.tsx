import React, { useState } from "react";
import {
  Printer,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "How do I set up my printer using Smart Drivers?",
    a: "Power on your printer, connect to Wi-Fi, download and install Smart Drivers, then add your printer in your PC's settings. Print a test page to confirm setup.",
  },
  {
    q: "What are Smart Drivers?",
    a: "Smart Drivers are advanced printer drivers that simplify setup, ensure compatibility, and keep your drivers up to date for smooth, reliable printing.",
  },
  {
    q: "How do I fix my printer showing as offline?",
    a: "Check connections, restart devices, set as default printer, update Smart Drivers, and clear the print queue.",
  },
  {
    q: "What are some common printer solutions?",
    a: "Check for offline status, paper jams, slow printing, driver errors, and ensure your printer is set as default.",
  },
];

const downloadSteps = [
  { label: "Verifying details", duration: 1000 },
  { label: "Initializing download", duration: 1200 },
  { label: "Downloading drivers", duration: 800 },
  { label: "Downloading 5 of 30 MB", duration: 700 },
  { label: "Downloading 10 of 30 MB", duration: 700 },
  { label: "Downloading 15 of 30 MB", duration: 700 },
  { label: "Downloading 20 of 30 MB", duration: 700 },
  { label: "Downloading 25 of 30 MB", duration: 700 },
  { label: "Completing download", duration: 1000 },
  { label: "Download complete!", duration: 1200 },
];

function SetupProgressPage() {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState(downloadSteps[0].label);
  const [showIssues, setShowIssues] = useState(false);
  React.useEffect(() => {
    let step = 0;
    function nextStep() {
      if (step < downloadSteps.length) {
        setProgress(Math.round((step / (downloadSteps.length - 1)) * 100));
        setProgressText(downloadSteps[step].label);
        setTimeout(() => {
          step++;
          nextStep();
        }, downloadSteps[step].duration);
      } else {
        setProgress(100);
        setProgressText("Scan completed");
        setTimeout(() => setShowIssues(true), 1200);
      }
    }
    nextStep();
  }, []);

  if (showIssues) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center mb-60">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 mt-16">
            <h1 className="text-3xl font-bold text-center text-slate-700 mb-8">
              Downloading drivers
            </h1>
            <div className="mb-8">
              <div className="text-xl text-slate-700 mb-2">Scan completed</div>
              <div className="w-full h-2 bg-red-300 rounded-full overflow-hidden mb-2">
                <div
                  className="h-2 bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `100%` }}
                ></div>
              </div>
              <div className="text-sm italic text-gray-500">
                Checking for compatibility issues...
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 mb-6">
              <div className="text-2xl font-bold text-red-600 mb-4">
                2 Issues Found
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center gap-2 text-lg text-gray-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  Printer Spooler Service Not Running.
                </li>
                <li className="flex items-center gap-2 text-lg text-gray-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  Network Port Not Set Correctly.
                </li>
              </ul>
              <a
                href="tel:18663990443"
                className="w-full block bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition-all mb-2 text-center"
              >
                Call Now (866) 399-0443
              </a>
              <div className="text-center text-gray-600 mt-4">
                Please contact{" "}
                <span className="font-semibold text-blue-600">
                  customer support
                </span>{" "}
                or{" "}
                <span className="font-semibold text-blue-600">
                  chat with us
                </span>{" "}
                for assistance.
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex items-center justify-center mb-60">
        <div className="w-full max-w-2xl mx-auto text-center animate-fade-in mt-32">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-12">
            Downloading drivers
          </h1>
          <div className="text-2xl text-slate-700 mb-8">
            {progressText}
            <span className="text-blue-400 animate-blink">|</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-3 bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-lg text-slate-600 mb-2">
            Initializing download{" "}
            <span className="text-blue-400 animate-blink">|</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SmartDrivers() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", number: "", model: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const navigate = useNavigate();

  // Handle form field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  // Validate form
  function validate() {
    const newErrors: { [k: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.number.trim()) newErrors.number = "Number is required";
    if (!form.model.trim()) newErrors.model = "Printer model is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setShowForm(false);
    setTimeout(() => navigate("/setup"), 300); // slight delay for modal close
  }

  // Modal form
  const FormModal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={() => setShowForm(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Install Smart Driver
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`border rounded-lg px-4 py-2 w-full ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Your Name"
              autoFocus
            />
            {errors.name && (
              <div className="text-xs text-red-500 mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className={`border rounded-lg px-4 py-2 w-full ${
                errors.number ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Phone Number"
            />
            {errors.number && (
              <div className="text-xs text-red-500 mt-1">{errors.number}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Printer Model
            </label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              className={`border rounded-lg px-4 py-2 w-full ${
                errors.model ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Printer Model"
            />
            {errors.model && (
              <div className="text-xs text-red-500 mt-1">{errors.model}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Start Download
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6 shadow-lg">
            <Printer className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Drivers
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The easiest way to set up, update, and troubleshoot your printer.
            Enjoy seamless printing with Smart Drivers—no hassle, just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-lg ring-2 ring-indigo-300 focus:ring-4 focus:outline-none"
            >
              Install Smart Driver <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:18663990443"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg ring-2 ring-green-300 focus:ring-4 focus:outline-none"
            >
              <Phone className="w-5 h-5" /> Call Now (866) 399-0443
            </a>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section id="setup" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Setup in Minutes
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">1. Power On</h3>
              <p className="text-gray-600 text-sm text-center">
                Make sure your printer is powered on and ready.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">2. Connect</h3>
              <p className="text-gray-600 text-sm text-center">
                Connect your printer to Wi-Fi or your PC as needed.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">
                3. Install Smart Drivers
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Download and install Smart Drivers for instant compatibility.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">4. Print Test Page</h3>
              <p className="text-gray-600 text-sm text-center">
                Add your printer in settings and print a test page to confirm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Troubleshooting Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-6 flex items-start gap-4 shadow">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Printer Offline?</h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Check connections and power.</li>
                  <li>Restart printer and computer.</li>
                  <li>Set as default printer in settings.</li>
                  <li>Update or reinstall Smart Drivers.</li>
                  <li>Clear the print queue and try again.</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 flex items-start gap-4 shadow">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Other Common Issues
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Paper jams: Remove stuck paper and reload properly.</li>
                  <li>Slow printing: Use draft mode or lower resolution.</li>
                  <li>Driver errors: Uninstall and reinstall Smart Drivers.</li>
                  <li>
                    Not printing: Check ink/toner and default printer setting.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-indigo-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{faq.q}</h3>
                    <p className="text-gray-700 text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-lg ring-2 ring-indigo-300 focus:ring-4 focus:outline-none"
            >
              Install Smart Driver <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:18663990443"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg ring-2 ring-green-300 focus:ring-4 focus:outline-none"
            >
              <Phone className="w-5 h-5" /> Call Now (866) 399-0443
            </a>
          </div>
        </div>
      </section>

      {/* Contact/Help Form (no backend) */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-2xl mx-auto rounded-2xl shadow-xl bg-white p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Need Additional Help?
          </h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="Your Name"
              />
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="Printer Model"
              />
            </div>
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Phone Number *"
              required
            />
            <textarea
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="How can we help you?"
              rows={4}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
      <Footer />
      {showForm && FormModal}
    </div>
  );
}

// Export the setup progress page for routing
export { SetupProgressPage };
