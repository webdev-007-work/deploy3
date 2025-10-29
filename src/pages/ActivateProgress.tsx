import React from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Phone } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const activationSteps = [
  { label: "Connecting to device", duration: 1000 },
  { label: "Verifying activation code", duration: 1200 },
  { label: "Activating your device", duration: 1200 },
  { label: "Finalizing setup", duration: 1000 },
  { label: "Activation complete!", duration: 1200 },
];

export default function ActivateProgress() {
  const { settings } = useSiteSettings();
  const callNowNumber = settings?.brand_phone || "+1 (888) 970-1698";
  const [progress, setProgress] = React.useState(0);
  const [progressText, setProgressText] = React.useState(
    activationSteps[0].label
  );
  const [step, setStep] = React.useState(1);
  const [accountProgress, setAccountProgress] = React.useState(0);
  const [accountText, setAccountText] = React.useState(
    "Connecting to account..."
  );
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    let s = 0;
    function nextStep() {
      if (s < activationSteps.length) {
        setProgress(Math.round((s / (activationSteps.length - 1)) * 100));
        setProgressText(activationSteps[s].label);
        setTimeout(() => {
          s++;
          nextStep();
        }, activationSteps[s].duration);
      } else {
        setProgress(100);
        setProgressText("Activation complete!");
        setTimeout(() => setStep(2), 1200);
      }
    }
    nextStep();
  }, []);

  React.useEffect(() => {
    if (step === 2) {
      let ap = 0;
      const accountSteps = [
        { label: "Connecting to account...", duration: 1000 },
        { label: "Verifying credentials", duration: 1200 },
        { label: "Accessing account data", duration: 1200 },
        { label: "Finalizing", duration: 1000 },
        { label: "Account data accessed!", duration: 1200 },
      ];
      function nextAccountStep() {
        if (ap < accountSteps.length) {
          setAccountProgress(
            Math.round((ap / (accountSteps.length - 1)) * 100)
          );
          setAccountText(accountSteps[ap].label);
          setTimeout(() => {
            ap++;
            nextAccountStep();
          }, accountSteps[ap].duration);
        } else {
          setAccountProgress(100);
          setAccountText("Account data accessed!");
          setTimeout(() => setShowSuccess(true), 1200);
        }
      }
      nextAccountStep();
    }
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Help Bar */}
      <div className="w-full bg-gray-100 py-3 text-center font-semibold text-lg text-gray-900 shadow-sm">
        Need Help? We are one call away from you!
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mt-16 mb-32 flex flex-col items-center animate-fade-in">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
                Step 1: Activating Your Device
              </h1>
              <div className="text-lg text-gray-600 mb-4 text-center">
                {progress < 100
                  ? "Trying to connect... Please wait"
                  : "Activation complete!"}
              </div>
              <div className="flex items-center justify-center mb-8 w-full">
                <div className="w-full md:w-2/3 h-64 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-black">
                  <span className="text-white text-2xl font-semibold animate-pulse">
                    {progress < 100 ? "Connecting..." : "Activated!"}
                  </span>
                </div>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-4 bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-base font-semibold text-gray-700 mt-2 mb-6">
                {progressText}
                <span className="text-indigo-400 animate-blink">|</span>
              </div>
            </>
          )}
          {step === 2 && !showSuccess && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center mt-8">
                Step 2: Trying to Access Your Account Data
              </h2>
              <div className="text-lg text-gray-600 mb-4 text-center">
                {accountProgress < 100
                  ? "Accessing your account... Please wait"
                  : "Account data accessed!"}
              </div>
              <div className="flex items-center justify-center mb-8 w-full">
                <div className="w-full md:w-2/3 h-64 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-black">
                  <span className="text-white text-2xl font-semibold animate-pulse">
                    {accountProgress < 100 ? "Accessing..." : "Done!"}
                  </span>
                </div>
              </div>
              <div className="w-full h-4 bg-indigo-400/40 rounded-full overflow-hidden mb-2">
                <div
                  className="h-4 bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${accountProgress}%` }}
                ></div>
              </div>
              <div className="text-base font-semibold text-gray-700 mt-2 mb-6">
                {accountText}
                <span className="text-indigo-400 animate-blink">|</span>
              </div>
            </>
          )}
          {showSuccess && (
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold text-green-600">Success!</p>
              <p className="text-lg text-gray-700">
                Your code has been activated successfully.
              </p>
              <p className="text-xl font-semibold text-blue-800">
                Final step- Call Support To Activate Your Device!
              </p>
              <a
                href={`tel:${callNowNumber}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Call Now {callNowNumber}
              </a>
              <p className="text-lg text-gray-500">
                Calling makes activation faster.
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Still seeing "Enter Code" on your TV?
              </p>
              <p className="text-gray-600">
                That's normal. Your device will refresh once setup is complete.
              </p>
            </div>
          )}

          {/* Help Bar inside card */}
          <div className="w-full mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-semibold text-lg text-gray-900">
              Need Help? We are one call away from you!
            </span>
            <a
              href={`tel:${callNowNumber}`}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold text-lg rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 16.92V19a2 2 0 01-2.18 2A19.72 19.72 0 713 5.18 2 2 0 715 3h2.09a2 2 0 712 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 712.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0721 17.91V19a2 2 0 01-2 2z"
                />
              </svg>
              Call Now {callNowNumber}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
