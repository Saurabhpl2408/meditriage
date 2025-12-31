import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Shield, Zap, Heart, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Get Clear Medical Guidance{' '}
              <span className="text-primary">in Seconds</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Describe your symptoms using voice or text, and receive instant, 
              evidence-based triage recommendations powered by advanced AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/symptom-checker">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Check Your Symptoms
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-safe" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>95% Accurate</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-urgent" />
                <span>24/7 Available</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How MediTriage Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, fast, and reliable symptom assessment in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe Symptoms</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use voice or text to describe how you're feeling
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced algorithms analyze your symptoms in seconds
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Guidance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive clear recommendations and urgency levels
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgency Levels */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Clear Urgency Levels</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Know exactly when to seek care
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-emergency/10 border border-emergency/20">
              <AlertTriangle className="h-8 w-8 text-emergency mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-emergency">Emergency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Call 911 immediately
              </p>
            </div>

            <div className="p-6 rounded-xl bg-urgent/10 border border-urgent/20">
              <Clock className="h-8 w-8 text-urgent mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-urgent">Urgent</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seek care within hours
              </p>
            </div>

            <div className="p-6 rounded-xl bg-non-urgent/10 border border-non-urgent/20">
              <CheckCircle2 className="h-8 w-8 text-non-urgent mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-non-urgent">Non-Urgent</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Schedule appointment
              </p>
            </div>

            <div className="p-6 rounded-xl bg-safe/10 border border-safe/20">
              <Heart className="h-8 w-8 text-safe mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-safe">Self-Care</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage at home
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Check Your Symptoms?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Get instant, AI-powered medical guidance. Free, private, and available 24/7.
            </p>
            <Link to="/symptom-checker">
              <Button variant="hero" size="xl" className="gap-2">
                Start Symptom Check
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}