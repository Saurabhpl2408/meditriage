import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span>MediTriage</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered symptom assessment for faster, smarter healthcare guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/symptom-checker" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link to="/medical-knowledge" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Medical Knowledge
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Medical Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:911" className="flex items-center gap-2 text-emergency font-semibold hover:underline">
                <Phone className="h-4 w-4" />
                Call 911
              </a>
              <a href="mailto:support@meditriage.com" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                support@meditriage.com
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <AlertTriangle className="h-5 w-5 text-urgent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Medical Disclaimer:</strong> MediTriage is for informational purposes only 
              and is NOT a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of qualified healthcare providers. In case of emergency, 
              call 911 immediately.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MediTriage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}