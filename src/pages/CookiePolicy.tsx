
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';

const CookiePolicy = () => {
  const effectiveDate = "March 16, 2024";
  const lastUpdated = "March 16, 2024";

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        
        <main className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <p>Effective Date: {effectiveDate}</p>
                <p>Last Updated: {lastUpdated}</p>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">
                  Welcome to Vivah! This Cookie Policy explains how Vivah ("we," "our," or "us") uses cookies and similar technologies when you visit our website and use our services.
                </p>
                
                <p>
                  By continuing to use Vivah, you agree to the use of cookies as described in this policy.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help websites function properly, improve user experience, and provide analytics.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">2.1 Essential Cookies</h3>
                <p>These cookies are necessary for the basic functionality of Vivah, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enabling user authentication and account management.</li>
                  <li>Ensuring security and fraud prevention.</li>
                  <li>Maintaining session continuity while browsing.</li>
                </ul>
                <p>Without these cookies, some parts of Vivah may not function correctly.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">2.2 Performance & Analytics Cookies</h3>
                <p>We use these cookies to understand how users interact with Vivah, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tracking website traffic and user behavior.</li>
                  <li>Identifying errors and improving website performance.</li>
                  <li>Analyzing user engagement to enhance features.</li>
                </ul>
                <p>We may use third-party analytics services such as Google Analytics to process this data.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">2.3 Functional Cookies</h3>
                <p>These cookies enable personalized experiences, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remembering user preferences (e.g., language, location).</li>
                  <li>Storing login details for faster access.</li>
                  <li>Customizing matchmaking and recommendation features.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">2.4 Advertising & Targeting Cookies</h3>
                <p>These cookies help us deliver relevant advertisements and promotional content by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tracking browsing activity across sessions.</li>
                  <li>Understanding user interests for better ad targeting.</li>
                  <li>Limiting the number of times an ad is shown.</li>
                </ul>
                <p>We may partner with third-party advertisers who use their own cookies.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Cookies</h2>
                <p>We use cookies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>✔ Provide a seamless and secure user experience.</li>
                  <li>✔ Improve matchmaking accuracy based on preferences.</li>
                  <li>✔ Monitor and analyze service performance.</li>
                  <li>✔ Deliver personalized recommendations and promotions.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Managing & Disabling Cookies</h2>
                <p>You can control or disable cookies through your browser settings. However, disabling essential cookies may limit your access to certain features of Vivah.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">4.1 Browser Settings</h3>
                <p>Most browsers allow users to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View cookies stored on their device.</li>
                  <li>Delete cookies manually.</li>
                  <li>Block cookies from being stored.</li>
                </ul>
                <p>To manage cookies in your browser, follow the instructions provided by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google Chrome: chrome://settings/cookies</li>
                  <li>Mozilla Firefox: about:preferences#privacy</li>
                  <li>Safari: Settings {'>'}  Privacy & Security</li>
                  <li>Microsoft Edge: edge://settings/content/cookies</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">4.2 Opt-Out of Tracking</h3>
                <p>If you wish to opt out of tracking, you can use:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google Analytics Opt-Out: https://tools.google.com/dlpage/gaoptout</li>
                  <li>Network Advertising Initiative (NAI) Opt-Out: http://www.networkadvertising.org/choices</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Third-Party Cookies</h2>
                <p>Some third-party services integrated into Vivah may place cookies on your device. These include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processors (e.g., local bank payment gateway).</li>
                  <li>Social media login providers (if applicable).</li>
                  <li>Analytics and advertising services.</li>
                </ul>
                <p>We do not control third-party cookies and recommend reviewing their privacy policies.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. Updates to This Cookie Policy</h2>
                <p>We may update this Cookie Policy periodically to reflect changes in technology or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date.</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default CookiePolicy;
