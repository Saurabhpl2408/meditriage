import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { UrgencyBadge } from '@/components/triage/UrgencyBadge';

export default function MedicalKnowledge() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Knowledge Base</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse conditions and symptoms. For educational purposes only.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conditions, symptoms..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <div className="text-center text-gray-500 py-20">
          <p>Medical knowledge search coming soon...</p>
          <p className="text-sm mt-2">Use the symptom checker for triage assessment</p>
        </div>
      </div>
    </div>
  );
}