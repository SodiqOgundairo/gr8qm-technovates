import React from "react";
import { useSearchParams } from "react-router-dom";

const Unsubscribe: React.FC = () => {
  const [params] = useSearchParams();
  const success = params.get("success") === "true";
  const error = params.get("error");
  const email = params.get("email");

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-oxford-card border border-oxford-border rounded-xl p-8">
          {success ? (
            <>
              <div className="text-4xl mb-4">&#10003;</div>
              <h1 className="text-xl font-bold text-white mb-2">
                Unsubscribed
              </h1>
              <p className="text-gray-400">
                {email ? (
                  <>
                    <strong className="text-gray-300">{email}</strong> has been
                    removed from our mailing list.
                  </>
                ) : (
                  "You've been removed from our mailing list."
                )}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                You will no longer receive marketing emails from GR8QM
                Technovates. Transactional emails (receipts, invoices) are not
                affected.
              </p>
            </>
          ) : error ? (
            <>
              <h1 className="text-xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-400">
                We couldn't process your unsubscribe request. Please try again
                or contact{" "}
                <a
                  href="mailto:hello@gr8qm.com"
                  className="text-skyblue hover:underline"
                >
                  hello@gr8qm.com
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white mb-2">
                Unsubscribe
              </h1>
              <p className="text-gray-400">
                If you reached this page from an email link, your unsubscribe
                request is being processed.
              </p>
            </>
          )}

          <a
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-skyblue hover:bg-skyblue/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Website
          </a>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          GR8QM Technovates &middot; Faith that builds. Impact that lasts.
        </p>
      </div>
    </div>
  );
};

export default Unsubscribe;
