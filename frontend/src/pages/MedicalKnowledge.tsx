import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ragService } from '@/services/ragService';

export default function MedicalKnowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      console.log('[Knowledge Search] Querying:', searchQuery);
      const response = await ragService.queryKnowledge(searchQuery, 5);
      console.log('[Knowledge Search] Results:', response);
      
      setResults(response.results || []);
    } catch (error: any) {
      console.error('[Knowledge Search] Error:', error);
      alert(`Search failed: ${error.message}\n\nMake sure RAG service is running and has documents loaded.`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Knowledge Search</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search our AI-powered medical knowledge base for information about conditions, symptoms, and treatments.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., What are symptoms of stroke? How to treat fever?"
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              size="lg"
              className="gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {results.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Found {results.length} relevant result{results.length !== 1 ? 's' : ''}
                </h2>
                
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Metadata */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {result.metadata.category && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            {result.metadata.category}
                          </span>
                        )}
                        {result.metadata.topic && (
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {result.metadata.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((result.score || 0) * 100)}% match
                      </span>
                    </div>

                    {/* Document Content */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.document}
                    </p>

                    {/* Source */}
                    {result.metadata.source && (
                      <p className="text-xs text-gray-500 mt-3">
                        Source: {result.metadata.source}
                      </p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try different keywords or check if medical documents are loaded
                </p>
                <p className="text-sm text-gray-500">
                  Tip: Make sure you've loaded sample documents into RAG service
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Example Queries */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <h3 className="font-semibold mb-4">Try these example searches:</h3>
            <div className="space-y-2">
              {[
                'What are the symptoms of a stroke?',
                'When should I see a doctor for fever?',
                'How to prevent dehydration?',
                'What causes chest pain?',
                'Pneumonia symptoms and treatment',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setSearchQuery(example);
                    setTimeout(handleSearch, 100);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Tip:</strong> This knowledge base uses AI-powered semantic search. 
            It understands your questions and finds relevant medical information even if you don't use exact medical terms.
          </p>
        </motion.div>
      </div>
    </div>
  );
}