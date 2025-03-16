
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';

const TermsOfService = () => {
  const effectiveDate = "March 16, 2024";
  const lastUpdated = "March 16, 2024";

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        
        <main className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <p>Effective Date: {effectiveDate}</p>
                <p>Last Updated: {lastUpdated}</p>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">
                  Welcome to Vivah! These Terms of Service ("Terms") govern your access and use of Vivah ("we," "our," "us," or "the Service"). By accessing or using Vivah, you agree to these Terms. If you do not agree, please do not use our services.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By creating an account or using Vivah, you confirm that you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Are at least 18 years old.</li>
                  <li>Have the legal capacity to enter into a binding agreement.</li>
                  <li>Agree to comply with these Terms and all applicable laws and regulations.</li>
                </ul>
                <p>We reserve the right to update these Terms at any time. Continued use of Vivah after updates constitutes acceptance of the revised Terms.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. Account Registration & Responsibilities</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">2.1 Account Creation</h3>
                <p>To use Vivah, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, complete, and up-to-date information.</li>
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Not create multiple accounts or impersonate another person.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">2.2 Account Security</h3>
                <p>You are responsible for all activity under your account. If you suspect unauthorized access, notify us immediately at support@vivah.com.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">2.3 Account Termination</h3>
                <p>We reserve the right to suspend or terminate accounts that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate these Terms.</li>
                  <li>Engage in fraudulent, abusive, or inappropriate behavior.</li>
                  <li>Are inactive for an extended period.</li>
                </ul>
                <p>Users can delete their accounts at any time through their profile settings.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Use of the Service</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">3.1 Permitted Use</h3>
                <p>You may use Vivah solely for personal, lawful, and non-commercial matchmaking purposes.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">3.2 Prohibited Conduct</h3>
                <p>Users must not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide false information or misrepresent their identity.</li>
                  <li>Harass, threaten, or exploit other users.</li>
                  <li>Send spam, solicitations, or commercial advertisements.</li>
                  <li>Attempt to hack, reverse-engineer, or disrupt Vivah.</li>
                  <li>Upload harmful content, including viruses or malware.</li>
                  <li>Share explicit, offensive, or inappropriate content.</li>
                  <li>Use Vivah for illegal or unethical activities.</li>
                </ul>
                <p>Violating these rules may result in immediate suspension or termination of your account.</p>

                {/* Continue with the rest of the terms of service sections */}
                <h2 className="text-xl font-semibold mt-8 mb-4">4. Subscription & Payment Terms</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">4.1 Premium Subscription</h3>
                <p>Vivah offers a subscription-based premium model, which includes additional features such as unlimited messaging and priority matchmaking.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">4.2 Payment Processing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payments are processed securely through a third-party payment gateway.</li>
                  <li>By subscribing, you authorize recurring payments until canceled.</li>
                  <li>All payments are non-refundable except as required by law.</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">4.3 Cancellation & Refunds</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may cancel your subscription at any time.</li>
                  <li>Cancellations take effect at the end of the current billing cycle.</li>
                  <li>Refunds are not provided unless legally required.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Privacy & Data Protection</h2>
                <p>Your use of Vivah is also governed by our Privacy Policy, which explains how we collect, store, and protect user data. By using the service, you consent to our data practices.</p>
                <p>For details, please review our <a href="/privacy-policy" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-400 dark:hover:text-matrimony-300">Privacy Policy</a>.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. User Safety & Reporting</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">6.1 User Safety</h3>
                <p>We prioritize user safety by implementing:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Profile verification measures.</li>
                  <li>Message screening for inappropriate content.</li>
                  <li>Reporting and blocking features for inappropriate behavior.</li>
                </ul>
                <p>However, Vivah does not conduct background checks on users. Please use caution when interacting with others.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">6.2 Reporting Violations</h3>
                <p>If you encounter misconduct, harassment, or suspicious activity, report it immediately via:</p>
                <p className="flex items-center mt-2 font-medium">📧 Email: support@vivah.com</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
                <p>All content, trademarks, logos, and software associated with Vivah are our exclusive property. Users may not copy, modify, or distribute any part of our service without written permission.</p>
                <p>Users retain rights to the content they upload but grant Vivah a limited, non-exclusive, royalty-free license to display profile content for matchmaking purposes.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
                <p>Vivah is provided "as is" and "as available." We do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Successful matches or relationships.</li>
                  <li>That all users will be genuine or trustworthy.</li>
                  <li>That the service will be uninterrupted or error-free.</li>
                </ul>
                <p>To the fullest extent permitted by law, Vivah is not liable for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any damages or losses resulting from user interactions.</li>
                  <li>Unauthorized access to or alteration of user data.</li>
                  <li>Technical failures or service interruptions.</li>
                </ul>
                <p>Users interact with others at their own risk.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">9. Indemnification</h2>
                <p>You agree to indemnify and hold Vivah, its affiliates, and employees harmless from any claims, damages, or liabilities arising from your use of the service, violations of these Terms, or infringement of third-party rights.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">10. Governing Law & Dispute Resolution</h2>
                <p>These Terms are governed by the laws of Sri Lanka.</p>
                <p>In case of disputes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users agree to resolve disputes through negotiation first.</li>
                  <li>If unresolved, disputes shall be settled by arbitration or mediation in Sri Lanka.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">11. Third-Party Links & Services</h2>
                <p>Vivah may contain links to third-party websites or services. We are not responsible for their privacy practices or terms. Users should review external policies before engaging with such services.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">12. Changes to These Terms</h2>
                <p>We may update these Terms periodically. If significant changes occur, we will notify users via email or in-app notifications. Continued use of Vivah after updates constitutes agreement to the new Terms.</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default TermsOfService;
