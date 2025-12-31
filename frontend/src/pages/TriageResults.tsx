import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, RefreshCw, Printer, CheckCircle2, Info, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UrgencyBadge } from '@/components/triage/UrgencyBadge';
import { ConditionMatchCard } from '@/components/triage/ConditionMatchCard';
import { useApp } from '@/context/AppContext';
import { ragService } from '@/services/ragService';
import { cn } from '@/lib/utils';

export default function TriageResults() {
  const navigate = useNavigate();
  const { triageResult, symptoms, clearSymptoms } = useApp();
  const [knowledgeResults, setKnowledgeResults] = useState<any[]>([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);

  useEffect(() => {
    if (!triageResult) {
      navigate('/symptom-checker');
      return;
    }

    // Fetch relevant medical knowledge based on top condition
    const fetchKnowledge = async () => {
      if (triageResult.topConditions.length > 0) {
        setLoadingKnowledge(true);
        try {
          const topCondition = triageResult.topConditions[0].condition.name;
          const query = `${topCondition} symptoms treatment care`;
          
          console.log('[RAG] Querying knowledge base:', query);
          const response = await ragService.queryKnowledge(query, 3);
          console.log('[RAG] Results:', response);
          
          setKnowledgeResults(response.results || []);
        } catch (error) {
          console.error('[RAG] Failed to fetch knowledge:', error);
          // Don't show error to user - RAG is optional enhancement
        } finally {
          setLoadingKnowledge(false);
        }
      }
    };

    fetchKnowledge();
  }, [triageResult, navigate]);

  if (!triageResult) return null;

  const handleStartOver = () => {
    clearSymptoms();
    navigate('/symptom-checker');
  };

  const urgencyConfig = {
    EMERGENCY: {
      bgClass: 'bg-emergency',
      textClass: 'text-white',
      icon: AlertTriangle,
    },
    URGENT: {
      bgClass: 'bg-urgent',
      textClass: 'text-white',
      icon: Clock,
    },
    NON_URGENT: {
      bgClass: 'bg-non-urgent',
      textClass: 'text-white',
      icon: CheckCircle2,
    },
    SELF_CARE: {
      bgClass: 'bg-safe',
      textClass: 'text-white',
      icon: CheckCircle2,
    },
  };

  const config = urgencyConfig[triageResult.urgencyLevel];
  const UrgencyIcon = config.icon;

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Urgency Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-2xl p-8 mb-8 text-center shadow-xl',
            config.bgClass,
            config.textClass,
            triageResult.urgencyLevel === 'EMERGENCY' && 'animate-pulse-emergency'
          )}
        >
          <UrgencyIcon className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {triageResult.urgencyLevel === 'EMERGENCY' && 'Medical Emergency'}
            {triageResult.urgencyLevel === 'URGENT' && 'Urgent Care Needed'}
            {triageResult.urgencyLevel === 'NON_URGENT' && 'Schedule Appointment'}
            {triageResult.urgencyLevel === 'SELF_CARE' && 'Self-Care Recommended'}
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Response Time: {triageResult.estimatedResponseTime}
          </p>
          
          {triageResult.urgencyLevel === 'EMERGENCY' && (
            <a href="tel:911">
              <Button size="xl" className="bg-white text-emergency hover:bg-gray-100 font-bold gap-2">
                <Phone className="h-5 w-5" />
                Call 911 Immediately
              </Button>
            </a>
          )}
        </motion.div>

        {/* Red Flags */}
        {triageResult.redFlagsDetected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 rounded-xl bg-emergency/10 border border-emergency/30"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-emergency flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-emergency mb-2">Red Flags Detected</h2>
                <ul className="space-y-1">
                  {triageResult.redFlagsDetected.map((flag, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emergency" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 mb-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-lg mb-1">Recommendation</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {triageResult.recommendation}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Possible Conditions */}
        {triageResult.topConditions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Possible Conditions</h2>
            <div className="space-y-4">
              {triageResult.topConditions.map((match, index) => (
                <ConditionMatchCard key={match.condition.id} match={match} rank={index + 1} />
              ))}
            </div>
          </motion.div>
        )}

        {/* 🆕 MEDICAL KNOWLEDGE FROM RAG */}
        {knowledgeResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Medical Information</h2>
                <span className="text-xs text-gray-500 ml-auto">
                  Powered by AI Knowledge Base
                </span>
              </div>
              
              <div className="space-y-4">
                {knowledgeResults.map((result, index) => (
                  <div 
                    key={result.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-primary">
                        {result.metadata.topic || 'Medical Information'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round((result.score || 0) * 100)}% relevant
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.document}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {loadingKnowledge && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading medical information...
            </div>
          </div>
        )}

        {/* Analysis Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 mb-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Analysis Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{triageResult.reasoning}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-semibold">{Math.round(triageResult.confidence * 100)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Urgency</p>
              <UrgencyBadge level={triageResult.urgencyLevel} size="sm" showIcon={false} />
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-urgent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Disclaimer:</strong> {triageResult.disclaimer}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Results
          </Button>
          <Button onClick={handleStartOver} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Start Over
          </Button>
        </motion.div>
      </div>
    </div>
  );
}