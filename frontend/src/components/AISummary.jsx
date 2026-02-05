import { Sparkles, X } from 'lucide-react';

/**
 * AI Summary Component
 * Displays AI-generated process summaries
 */
function AISummary({ summary, loading, onClose }) {
    if (loading) {
        return (
            <div className="ai-summary">
                <h3>
                    <Sparkles size={18} />
                    AI Analysis
                </h3>
                <p>Generating summary...</p>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="ai-summary">
            <div className="ai-summary-header">
                <h3>
                    <Sparkles size={18} />
                    AI Analysis
                </h3>
                {onClose && (
                    <button className="btn-icon" onClick={onClose}>
                        <X size={18} />
                    </button>
                )}
            </div>
            <p>{summary.summary}</p>
        </div>
    );
}

export default AISummary;
