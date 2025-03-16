
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';

const PrivacyPolicy = () => {
  const effectiveDate = "March 16, 2024";
  const lastUpdated = "March 16, 2024";

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        
        <main className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <p>Effective Date: {effectiveDate}</p>
                <p>Last Updated: {lastUpdated}</p>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">
                  Welcome to Vivah. Your privacy is important to us. This Privacy Policy explains how Vivah ("we," "our," or "us") collects, uses, discloses, and protects your personal information when you use our website and services.
                </p>
                
                <p>
                  By accessing or using Vivah, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect various types of information to provide and improve our services.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">1.1 Information You Provide Directly</h3>
                <p>When you register, create a profile, or interact with other users, you provide:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Details:</strong> Name, date of birth, sex, height, weight, civil status (single, divorced, widowed/widower), interests, lifestyle choices, religion, location, and other optional details.</li>
                  <li><strong>Photos and Bio:</strong> You must upload profile photos and a bio to use our services.</li>
                  <li><strong>Payment Information:</strong> When subscribing to our premium services, we collect billing details. Payments are processed securely via a third-party payment provider.</li>
                  <li><strong>Communication Data:</strong> Messages exchanged between users, reports, or feedback submitted to us.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">1.2 Information Collected Automatically</h3>
                <p>When you use Vivah, we automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device & Usage Data:</strong> IP address, browser type, operating system, app usage patterns, and interactions with features.</li>
                  <li><strong>Cookies & Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and analyze site traffic.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">1.3 Information from Third-Party Sources</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If you register using a third-party service (e.g., Google, Facebook), we collect information authorized by you from those accounts.</li>
                  <li>Payment providers share transaction details but not full payment information.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Provide and Improve Services:</strong> Matchmaking, user interaction, and profile discovery.</li>
                  <li><strong>Enhance User Safety:</strong> Monitor for fraud, abuse, and policy violations.</li>
                  <li><strong>Process Payments:</strong> Manage subscriptions and transactions securely.</li>
                  <li><strong>Communicate with You:</strong> Send important service updates, promotional content, and customer support responses.</li>
                  <li><strong>Comply with Legal Obligations:</strong> Adhere to applicable laws and regulations.</li>
                </ul>

                {/* Continue with the rest of the privacy policy sections */}
                <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
                <p>We do not sell or rent user data. However, we may share your information with:</p>

                <h3 className="text-lg font-medium mt-6 mb-3">3.1 Service Providers</h3>
                <p>Cloud storage, payment processing, customer support, and security monitoring providers.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">3.2 Legal Compliance & Protection</h3>
                <p>If required by law, court order, or to protect the rights, property, or safety of Vivah and its users.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">3.3 Business Transfers</h3>
                <p>If Vivah undergoes a merger, acquisition, or sale, user data may be transferred to the new entity.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
                <p>We implement industry-standard security measures, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> Protecting sensitive data at rest and in transit.</li>
                  <li><strong>Access Control:</strong> Restricting access to personal data.</li>
                  <li><strong>Regular Security Audits:</strong> Monitoring for potential vulnerabilities.</li>
                </ul>
                <p>However, no system is 100% secure. Users are responsible for keeping their credentials safe.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights & Choices</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">5.1 Access, Update, or Delete Your Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users can edit or delete their profiles through the settings.</li>
                  <li>To request data deletion, contact support@vivah.com.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">5.2 Opt-Out Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You can opt out of marketing emails by adjusting notification settings.</li>
                  <li>You can disable cookies in your browser, though this may affect functionality.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Retention</h2>
                <p>We retain user data only as long as necessary for matchmaking services, legal compliance, and security purposes. Inactive accounts may be deleted after a certain period.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
                <p>Vivah is not intended for users under the age of 18. We do not knowingly collect data from minors. If we discover such data, it will be deleted immediately.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">8. Third-Party Links & Services</h2>
                <p>Vivah may contain links to external websites. We are not responsible for their privacy practices. Users should review the privacy policies of third-party services they engage with.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy periodically. Users will be notified of significant changes through email or in-app notifications. Continued use of Vivah after updates constitutes acceptance of the revised policy.</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default PrivacyPolicy;
