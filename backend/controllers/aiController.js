const asyncHandler = require('express-async-handler');
const Document = require('../models/documentModel.js');
const natural = require('natural'); // ✅ FREE NLP library

// ==========================================================
// FREE TEXT PROCESSING FUNCTIONS
// ==========================================================

/**
 * Simple text similarity calculation (FREE)
 */
const calculateTextSimilarity = (query, text) => {
    const tokenizer = new natural.WordTokenizer();
    
    const queryTokens = tokenizer.tokenize(query.toLowerCase());
    const textTokens = tokenizer.tokenize(text.toLowerCase());
    
    // Simple Jaccard similarity
    const intersection = queryTokens.filter(token => textTokens.includes(token));
    const union = [...new Set([...queryTokens, ...textTokens])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
};

/**
 * Advanced text search with multiple strategies (FREE)
 */
const advancedTextSearch = async (query) => {
    try {
        console.log('🔍 Using advanced text search (FREE)');
        
        // Strategy 1: MongoDB Text Search (if index exists)
        try {
            const textSearchResults = await Document.find(
                { $text: { $search: query } },
                { 
                    score: { $meta: "textScore" },
                    title: 1,
                    originalFilename: 1,
                    textContent: 1,
                    category: 1
                }
            )
            .sort({ score: { $meta: "textScore" } })
            .limit(5)
            .lean();

            if (textSearchResults.length > 0) {
                console.log(`📚 Found ${textSearchResults.length} documents via MongoDB text search`);
                return textSearchResults.map(doc => ({
                    ...doc,
                    score: doc.score || 0.8, // Default high score for text search
                    searchMethod: 'textIndex'
                }));
            }
        } catch (error) {
            console.log('MongoDB text index not available, using keyword search');
        }

        // Strategy 2: Keyword-based search with regex
        const keywords = query.split(' ')
            .filter(word => word.length > 2)
            .map(word => word.toLowerCase());

        if (keywords.length === 0) {
            return await Document.find().limit(3).lean();
        }

        const regexPatterns = keywords.map(word => new RegExp(word, 'i'));
        
        const keywordResults = await Document.find({
            $or: [
                { title: { $in: regexPatterns } },
                { textContent: { $in: regexPatterns } },
                { originalFilename: { $in: regexPatterns } },
                { category: { $in: regexPatterns } }
            ]
        })
        .limit(5)
        .lean();

        // Calculate similarity scores for keyword results
        const scoredResults = keywordResults.map(doc => {
            const titleSimilarity = calculateTextSimilarity(query, doc.title || '');
            const contentSimilarity = calculateTextSimilarity(query, doc.textContent?.substring(0, 500) || '');
            const filenameSimilarity = calculateTextSimilarity(query, doc.originalFilename || '');
            
            // Weighted average
            const finalScore = (titleSimilarity * 0.5) + (contentSimilarity * 0.3) + (filenameSimilarity * 0.2);
            
            return {
                ...doc,
                score: finalScore,
                searchMethod: 'keyword'
            };
        });

        // Sort by calculated score
        scoredResults.sort((a, b) => b.score - a.score);
        
        console.log(`📚 Found ${scoredResults.length} documents via keyword search`);
        return scoredResults.slice(0, 3); // Return top 3

    } catch (error) {
        console.error('Error in advanced text search:', error);
        
        // Final fallback: get random documents
        const randomDocs = await Document.aggregate([{ $sample: { size: 3 } }]);
        console.log('🔄 Using random documents as fallback');
        
        return randomDocs.map(doc => ({
            ...doc,
            score: 0.1,
            searchMethod: 'random'
        }));
    }
};

/**
 * Generate response using rule-based system (FREE)
 */
const generateRuleBasedResponse = async (userQuery, context) => {
    console.log('🤖 Using rule-based response system (FREE)');
    
    // Simple rule-based response based on context analysis
    const queryLower = userQuery.toLowerCase();
    
    // Check if context contains relevant information
    const hasRelevantInfo = context.toLowerCase().includes(queryLower) || 
                           queryLower.split(' ').some(word => 
                               word.length > 3 && context.toLowerCase().includes(word)
                           );

    if (!hasRelevantInfo) {
        return "Maaf, saya tidak dapat menemukan informasi mengenai hal tersebut di dalam dokumen yang ada. Silakan coba dengan kata kunci yang lebih spesifik.";
    }

    // Extract key information from context
    const sentences = context.split('.').filter(sentence => sentence.length > 10);
    const relevantSentences = sentences.filter(sentence =>
        queryLower.split(' ').some(word =>
            word.length > 3 && sentence.toLowerCase().includes(word)
        )
    );

    if (relevantSentences.length > 0) {
        const answer = `Berdasarkan dokumen yang ada:\n\n${relevantSentences.slice(0, 3).join('. ')}.`;
        return answer;
    }

    // Generic response for when some context exists but no direct matches
    return "Informasi terkait pertanyaan Anda terdapat dalam dokumen yang tersedia. Silakan buka dokumen sumber untuk detail lengkapnya.";
};

// ==========================================================
// MAIN CONTROLLER - 100% FREE VERSION
// ==========================================================

const handleChatQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;

    // Validate input
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Query is required and cannot be empty' 
        });
    }

    try {
        console.log('🔍 Processing query (FREE mode):', query);

        // Step 1: Find relevant documents using FREE text search
        const documents = await advancedTextSearch(query);
        console.log(`📚 Found ${documents.length} relevant documents`);

        if (documents.length === 0) {
            return res.json({ 
                success: true,
                answer: "Maaf, saya tidak dapat menemukan dokumen yang relevan dengan pertanyaan Anda. Silakan coba dengan kata kunci yang berbeda.",
                sources: [],
                searchType: 'free_text'
            });
        }

        // Step 2: Build context from documents
        const context = documents.map((doc, index) => {
            const content = doc.textContent ? 
                doc.textContent.substring(0, 1000) : 
                'Konten tidak tersedia';
            const title = doc.title || doc.originalFilename || 'Dokumen tanpa judul';
            
            return `Dokumen ${index + 1} - "${title}" (Kecocokan: ${Math.round(doc.score * 100)}%):\n${content}...`;
        }).join('\n\n');

        // Step 3: Generate response using FREE rule-based system
        const answer = await generateRuleBasedResponse(query, context);
        console.log('✅ Response generated (FREE mode)');

        // Step 4: Format sources
        const sources = documents.map(doc => ({
            _id: doc._id,
            title: doc.title || doc.originalFilename || 'Dokumen',
            score: Math.round(doc.score * 100),
            searchMethod: doc.searchMethod
        }));

        res.json({ 
            success: true,
            answer, 
            sources,
            searchType: 'free_text',
            note: 'Menggunakan sistem pencarian teks gratis'
        });

    } catch (error) {
        console.error('❌ Error in handleChatQuery:', error);
        
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat memproses pertanyaan. Silakan coba lagi.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check
const checkAIHealth = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'FREE AI service is running',
        mode: 'FREE_TEXT_SEARCH',
        features: [
            'MongoDB text search',
            'Keyword matching', 
            'Rule-based responses',
            '100% Free'
        ]
    });
});

module.exports = {
    handleChatQuery,
    checkAIHealth
};