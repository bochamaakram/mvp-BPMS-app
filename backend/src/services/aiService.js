const instanceService = require('./instanceService');

/**
 * Generate AI summary from process history
 * Uses a mock response if no LLM API is configured
 */
const generateSummary = async (instanceId) => {
    // Get instance history
    const history = await instanceService.getHistory(instanceId);
    const instance = await instanceService.getById(instanceId);

    if (!instance) {
        throw new Error('Instance not found');
    }

    // Format history for LLM
    const historyText = history.map(h =>
        `[${new Date(h.performed_at).toLocaleString()}] Step: ${h.step_name || 'N/A'}, Status: ${h.status}, Notes: ${h.notes || 'None'}`
    ).join('\n');

    // Check if LLM API is configured
    const apiKey = process.env.LLM_API_KEY;

    if (apiKey) {
        // Call actual LLM API (OpenAI example)
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a process analyst. Summarize the following process execution history in 2-3 sentences.',
                        },
                        {
                            role: 'user',
                            content: `Process: ${instance.process_name}\nStatus: ${instance.status}\n\nHistory:\n${historyText}`,
                        },
                    ],
                    max_tokens: 150,
                }),
            });

            const data = await response.json();
            return {
                summary: data.choices[0].message.content,
                instance: instance.process_name,
                status: instance.status,
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error('LLM API error:', error);
            // Fall back to mock
        }
    }

    // Mock summary when no API key
    const summary = generateMockSummary(instance, history);

    return {
        summary,
        instance: instance.process_name,
        status: instance.status,
        generatedAt: new Date().toISOString(),
    };
};

/**
 * Generate a mock summary based on history data
 */
const generateMockSummary = (instance, history) => {
    const stepCount = new Set(history.map(h => h.step_id)).size;
    const duration = history.length > 0
        ? Math.round((new Date() - new Date(history[history.length - 1].performed_at)) / (1000 * 60))
        : 0;

    let statusText;
    switch (instance.status) {
        case 'approved':
            statusText = 'successfully completed';
            break;
        case 'rejected':
            statusText = 'was rejected';
            break;
        default:
            statusText = 'is currently in progress';
    }

    return `The process "${instance.process_name}" ${statusText}. It has gone through ${stepCount} step(s) over approximately ${duration} minutes with ${history.length} recorded action(s).`;
};

module.exports = {
    generateSummary,
};
