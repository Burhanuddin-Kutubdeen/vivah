
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';

const LicensesPolicy = () => {
  const effectiveDate = "March 16, 2024";
  const lastUpdated = "March 16, 2024";

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        
        <main className="pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-6">Licenses Policy</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <p>Effective Date: {effectiveDate}</p>
                <p>Last Updated: {lastUpdated}</p>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">
                  This Licenses Policy describes the rights granted to users and the ownership of content, software, trademarks, and other intellectual property related to Vivah. By using Vivah, you agree to comply with this policy.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. Ownership & Intellectual Property</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">1.1 Application Ownership</h3>
                <p>All content, features, design elements, trademarks, logos, and software on Vivah ("the Application") are owned by Vivah or its licensors. Unauthorized reproduction, modification, or distribution of any part of Vivah is strictly prohibited.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">1.2 User-Generated Content</h3>
                <p>Users retain ownership of the content they upload, such as photos, bios, and messages. However, by submitting content, you grant Vivah a worldwide, non-exclusive, royalty-free license to use, display, and distribute the content as needed for service functionality.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. License to Use Vivah</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">2.1 Grant of License</h3>
                <p>We grant you a limited, non-exclusive, revocable, and non-transferable license to access and use Vivah for personal, non-commercial purposes.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">2.2 Restrictions</h3>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reverse-engineer, modify, or distribute Vivah's software.</li>
                  <li>Use Vivah for unlawful purposes or commercial resale.</li>
                  <li>Extract or scrape user data or content.</li>
                  <li>Use automated systems (bots, crawlers) without permission.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Third-Party Licenses</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">3.1 Third-Party Services</h3>
                <p>Vivah may use third-party services, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Firebase (Google) for cloud storage and real-time messaging.</li>
                  <li>Payment gateway services from a local Sri Lankan bank.</li>
                </ul>
                <p>Use of third-party services is subject to their respective license terms.</p>

                <h3 className="text-lg font-medium mt-6 mb-3">3.2 Open-Source Components</h3>
                <p>If Vivah uses open-source software, the applicable licenses (e.g., MIT, Apache 2.0) will be disclosed where required.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Termination of License</h2>
                <p>Your license to use Vivah may be revoked if you violate this policy or engage in prohibited activities. Upon termination, you must cease using Vivah and delete any associated content.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. Updates to This Policy</h2>
                <p>We may update this Licenses Policy periodically. Continued use of Vivah after changes means you accept the updated terms.</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default LicensesPolicy;
