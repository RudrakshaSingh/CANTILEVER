import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';

function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: July 30, 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span>1. Introduction</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At NewsHub, we value your privacy and are committed to
                protecting your personal information. This Privacy Policy
                explains how we collect, use, and safeguard your data when you
                use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>2. Information We Collect</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  and other details you provide when creating an account or
                  subscribing to our newsletter.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use the
                  Service, such as pages visited, articles read, and time spent
                  on the site.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, and other technical details collected
                  automatically.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="w-6 h-6 text-purple-600" />
                <span>3. How We Use Your Information</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                <li>Provide and improve the Service.</li>
                <li>Personalize your experience, such as recommending articles.</li>
                <li>Send newsletters and promotional communications (with your consent).</li>
                <li>Monitor and analyze usage to enhance functionality.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>4. Sharing Your Information</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your data
                with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                <li>
                  Service providers who assist us in operating the Service (e.g.,
                  hosting, analytics).
                </li>
                <li>
                  Legal authorities when required by law or to protect our
                  rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="w-6 h-6 text-purple-600" />
                <span>5. Data Security</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement reasonable security measures to protect your data,
                including encryption and secure servers. However, no method of
                transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span>6. Your Rights</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt out of marketing communications.</li>
                <li>Request data portability.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                To exercise these rights, contact us at{' '}
                <a
                  href="mailto:support@newshub.com"
                  className="text-purple-600 hover:text-purple-800"
                >
                  support@newshub.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>7. Cookies and Tracking</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to enhance your experience, analyze usage, and
                deliver personalized content. You can manage your cookie
                preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span>8. Third-Party Links</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The Service may contain links to third-party websites. We are not
                responsible for the privacy practices or content of these sites.
                We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lock className="w-6 h-6 text-purple-600" />
                <span>9. Changes to This Policy</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will
                be posted on this page, and the "Last updated" date will be
                revised accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>10. Contact Us</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy, please contact
                us at{' '}
                <a
                  href="mailto:support@newshub.com"
                  className="text-purple-600 hover:text-purple-800"
                >
                  support@newshub.com
                </a>{' '}
                or visit our{' '}
                <Link
                  to="/contact"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Contact
                </Link>{' '}
                page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Privacy;