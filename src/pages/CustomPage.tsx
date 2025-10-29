import React from "react";
import JsxParser from "react-jsx-parser";

interface CustomPageProps {
  code: string;
}

const CustomPage: React.FC<CustomPageProps> = ({ code }) => {
  return (
    <div className="prose max-w-3xl mx-auto py-12">
      <JsxParser
        components={{}}
        jsx={code}
        renderError={() => (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="bg-red-100 border border-red-200 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
              <svg
                className="w-12 h-12 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-600 text-center mb-2">
                Please check back again later !
              </p>
              <p className="text-xs text-red-400 text-center">
                If you continue to see this, contact the developer for help.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default CustomPage;
