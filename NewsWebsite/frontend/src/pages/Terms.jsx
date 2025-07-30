import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';

function Terms() {
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
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: July 30, 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using NewsHub ("the Service"), you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, please do not use the Service. We reserve the
                right to update or modify these Terms at any time, and such
                changes will be effective upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>2. Use of the Service</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You must be at least 13 years old to use the Service. You agree
                to use the Service only for lawful purposes and in a manner that
                does not infringe the rights of others or restrict their use of
                the Service. Prohibited activities include, but are not limited
                to, unauthorized access to our systems, distribution of malware,
                or engaging in any activity that disrupts the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span>3. User Accounts</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To access certain features, you may need to create an account.
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. Notify us immediately at{' '}
                <a
                  href="mailto:support@newshub.com"
                  className="text-purple-600 hover:text-purple-800"
                >
                  support@newshub.com
                </a>{' '}
                if you suspect unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <span>4. Content</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                NewsHub provides news content from various sources. We do not
                guarantee the accuracy, completeness, or reliability of any
                content. You acknowledge that reliance on any information
                provided by the Service is at your own risk. User-generated
                content, if applicable, must comply with our content guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>5. Limitation of Liability</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                NewsHub is provided "as is" without warranties of any kind. We
                are not liable for any damages arising from your use of the
                Service, including but not limited to direct, indirect,
                incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span>6. Termination</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may suspend or terminate your access to the Service at our
                discretion, particularly if you violate these Terms. Upon
                termination, your right to use the Service will cease
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <span>7. Governing Law</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of the State of California,
                USA, without regard to its conflict of law principles. Any
                disputes arising from these Terms will be resolved in the state
                or federal courts located in California.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span>8. Contact Us</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us
                at{' '}
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

export default Terms;