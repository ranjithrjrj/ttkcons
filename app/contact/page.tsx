// app/contact/page.tsx
import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | TTK Constructions',
  description: 'Get in touch with TTK Constructions. Reach out to our team via phone, email, or by filling out the contact form.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Get In Touch</h1>
          <p className="text-xl font-light max-w-2xl">
            We&apos;re ready to discuss your next major infrastructure project. Reach out to our team via phone, email, or by filling out the form below.
          </p>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Talk to Our Project Consultants
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-8 lg:col-span-1">
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
                <div className="flex items-start">
                  <Phone className="text-blue-900 mr-4 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Phone & Fax</h3>
                    <p className="text-gray-600">
                      Head Office: <span className="font-semibold">0452 - 2537733</span>
                    </p>
                    <p className="text-gray-600">
                      Mobile:{' '}
                      <span className="font-semibold text-amber-600">+91 99887 76655</span>
                    </p>
                    <p className="text-gray-600">Fax: 0452 - 2537734</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
                <div className="flex items-start">
                  <Mail className="text-blue-900 mr-4 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Email Addresses</h3>
                    <p className="text-gray-600">
                      General Enquiries:{' '}
                      <span className="font-semibold text-blue-700">info@ttkcons.in</span>
                    </p>
                    <p className="text-gray-600">
                      Tender & Bids:{' '}
                      <span className="font-semibold text-blue-700">tenders@ttkcons.in</span>
                    </p>
                    <p className="text-gray-600">
                      Careers:{' '}
                      <span className="font-semibold text-blue-700">careers@ttkcons.in</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
                <div className="flex items-start">
                  <MapPin className="text-blue-900 mr-4 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Head Office</h3>
                    <p className="text-gray-600 font-medium">TTK Towers, No: 321, 2nd Floor,</p>
                    <p className="text-gray-600 font-medium">80 Feet Road, LIG Colony, </p>
                    <p className="text-gray-600 font-medium text-amber-600">
                      Anna Nagar, Madurai – 625 020, Tamil Nadu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/ttkcons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f text-white text-xl"></i>
                  </a>
                  <a
                    href="https://instagram.com/ttkcons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 flex items-center justify-center transition-all"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram text-white text-xl"></i>
                  </a>
                  <a
                    href="https://linkedin.com/company/ttkcons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin-in text-white text-xl"></i>
                  </a>
                  <a
                    href="https://x.com/ttkcons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <i className="fab fa-x-twitter text-white text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Component - This replaces the inline form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
            Find Our Location
          </h2>
          <div className="h-96 w-full rounded-lg shadow-xl overflow-hidden border-4 border-amber-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15682.029809968846!2d78.09315625!3d9.92348325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c5c361e6c38b%3A0x8e8e6e8e8e8e8e8e!2sAnna%20Nagar%2C%20Madurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1625078400000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="TTK Constructions Office Location"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}