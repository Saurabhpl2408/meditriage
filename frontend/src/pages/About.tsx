import { motion } from 'framer-motion';
import { Shield, Brain, Heart, Activity } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-12 md:py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About MediTriage</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-powered symptom assessment to help you make informed healthcare decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
            <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Safety First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Emergency symptoms flagged with immediate 911 guidance
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
            <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Evidence-Based</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trained on peer-reviewed medical literature
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Patient-Centered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clear, actionable guidance to reduce anxiety
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}