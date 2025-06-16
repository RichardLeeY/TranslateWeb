// Configuration
// IMPORTANT: Update these values after deploying the backend
const config = {
    // Replace with your API Gateway endpoint URL
    apiEndpoint: '',
    // Replace with your API key (consider using environment variables in production)
    apiKey: '',
    // Supported languages for translation
    supportedLanguages: {
        'zh': '简体中文 (Simplified Chinese)',
        'zh-TW': '繁体中文 (Traditional Chinese)',
        'ja': '日本語 (Japanese)',
        'vi': 'Tiếng Việt (Vietnamese)',
        'es': 'Español (Spanish)',
        'pt': 'Português (Portuguese)',
        'ru': 'Русский (Russian)',
        'tr': 'Türkçe (Turkish)'
    },
    // Available translation models
    languageModels: {
        'nova-micro': 'Nova Micro',
        'nova-lite': 'Nova Lite',
        'nova-pro': 'Nova Pro',
        'claude-3.5-haiku': 'Claude 3.5 Haiku'
    }
};

// Check if configuration is set
function isConfigured() {
    return config.apiEndpoint && config.apiKey;
}

// Sample articles (in English)
const articles = [
    {
        id: '1',
        title: "EigenLayer Expands Integrations with Mantle Network and ZKsync, Enhancing Ethereum's Modular Security",
        content: "EigenLayer has expanded its integrations with Mantle Network and ZKsync, enhancing its role in Ethereum's modular security stack. Mantle Network has adopted EigenDA for data availability, transitioning from a limited operator system to a more robust network, improving scalability and economic security. ZKsync has integrated EigenDA for scalable data storage and EigenLayer's Autonomous Verifiable Services (AVSs) for decentralized zk proving, moving away from centralized cloud providers. EigenLayer's restaking model, which currently lacks slashing penalties, attracts risk-averse capital, contributing to its $9.4 billion TVL, significantly higher than Symbiotic's $1 billion. These developments reflect a shift towards a 'verifiable cloud' and growing demand for modular blockchain infrastructure.",
        date: "March 19, 2025"
    },
    {
        id: '2',
        title: 'Volatility Shares Launches First Solana Futures ETF',
        content: 'According to Bloomberg, Florida-based Volatility Shares LLC will launch the first ETFs tracking Solana futures this Thursday, including the Volatility Shares Solana ETF (SOLZ), which tracks Solana futures, and the Volatility Shares 2X Solana ETF (SOLT), which provides double leveraged exposure.',
        date: "March 18, 2025"
    },
    {
        id: '3',
        title: 'Solana co-founder apologizes for controversial advertisement',
        content: "According to TechFlow news, on March 20, Solana co-founder Anatoly Yakovenko (@aeyakovenko) posted on the X platform, publicly apologizing for the recently controversial Solana advertisement. In his post, he stated: \"This advertisement was indeed terrible and still makes me feel uneasy. I am ashamed for previously downplaying the issue rather than directly pointing out its essence — a malicious attack against marginalized groups. I appreciate the developers and artists in the ecosystem who immediately pointed out the problem both publicly and privately. You are the only bright spot in this chaos. I will do my best to ensure that the Solana Foundation focuses on its mission of decentralized and open-source software development, away from cultural wars.\" \nThe controversy arose from a previously released promotional short film by Solana that has since been deleted. In the advertisement, a man named \"American\" (symbolizing traditional American values) engages in a dialogue with a consultant (symbolizing certain modern societal ideologies). After the advertisement was released, it sparked intense controversy within the community. Critics argued that the advertisement targeted marginalized groups such as the transgender community, ignoring the significant contributions these groups have made in the fields of open source, cryptography, and security.",
        date: "March 20, 2025"
    }
];

// Cache for translated articles
let translationCache = {};

// DOM elements and initialization
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const languageSelector = document.getElementById('language-select');
    const modelSelectorA = document.getElementById('model-select-a');
    const modelSelectorB = document.getElementById('model-select-b');
    const articlesContainer = document.querySelector('.articles-container');
    const loadingIndicator = document.getElementById('loading');

    // Initialize the app
    initApp();
    addFavicon();

    // Initialize the app
    function initApp() {
        // Display all articles with comparison columns
        displayArticlesWithComparison();
        
        // Add event listeners
        languageSelector.addEventListener('change', handleLanguageOrModelChange);
        modelSelectorA.addEventListener('change', handleLanguageOrModelChange);
        modelSelectorB.addEventListener('change', handleLanguageOrModelChange);
        
        // Check if API is configured
        if (!isConfigured()) {
            showConfigurationWarning();
            return;
        }
        
        // Initial translation
        translateAllArticles();
    }
    
    // Show configuration warning if API details are not set
    function showConfigurationWarning() {
        const warningElement = document.createElement('div');
        warningElement.className = 'config-warning';
        warningElement.innerHTML = `
            <h3>⚠️ Configuration Required</h3>
            <p>Before using this application, you need to configure the API endpoint and API key.</p>
            <p>Please update the <code>config</code> object in <code>public/js/app.js</code> with your API details.</p>
            <ol>
                <li>Open <code>public/js/app.js</code> in a code editor</li>
                <li>Update the <code>apiEndpoint</code> with your API Gateway URL</li>
                <li>Update the <code>apiKey</code> with your API key</li>
                <li>Refresh this page</li>
            </ol>
            <p><strong>Note:</strong> In a production environment, consider using environment variables or a secure configuration service instead of hardcoding API keys.</p>
        `;
        
        // Insert at the top of the articles container
        articlesContainer.insertBefore(warningElement, articlesContainer.firstChild);
    }

    // Display all articles with comparison columns
    function displayArticlesWithComparison() {
        articlesContainer.innerHTML = '';
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.id = `article-${article.id}`;
            
            articleCard.innerHTML = `
                <div class="article-header">
                    <h2>${article.title}</h2>
                    <span class="article-date">${article.date}</span>
                </div>
                <div class="article-columns">
                    <div class="article-column column-original">
                        <h3>Original (English)</h3>
                        <h4>${article.title}</h4>
                        <p>${article.content}</p>
                    </div>
                    <div class="article-column column-model-a" id="model-a-${article.id}">
                        <h3>
                            Translation (Model A)
                            <span class="model-badge">${config.languageModels[modelSelectorA.value]}</span>
                        </h3>
                        <h4>Loading title...</h4>
                        <p>Loading content...</p>
                    </div>
                    <div class="article-column column-model-b" id="model-b-${article.id}">
                        <h3>
                            Translation (Model B)
                            <span class="model-badge">${config.languageModels[modelSelectorB.value]}</span>
                        </h3>
                        <h4>Loading title...</h4>
                        <p>Loading content...</p>
                    </div>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
    }

    // Handle language or model change
    function handleLanguageOrModelChange() {
        // Update model badges
        updateModelBadges();
        
        // Translate all articles
        translateAllArticles();
    }
    
    // Update model badges in the UI
    function updateModelBadges() {
        const modelABadges = document.querySelectorAll('.column-model-a .model-badge');
        const modelBBadges = document.querySelectorAll('.column-model-b .model-badge');
        
        modelABadges.forEach(badge => {
            badge.textContent = config.languageModels[modelSelectorA.value];
        });
        
        modelBBadges.forEach(badge => {
            badge.textContent = config.languageModels[modelSelectorB.value];
        });
    }

    // Translate all articles
    async function translateAllArticles() {
        const targetLanguage = languageSelector.value;
        const modelA = modelSelectorA.value;
        const modelB = modelSelectorB.value;
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        
        try {
            // Translate each article with both models
            for (const article of articles) {
                // Translate with Model A
                const modelAContainer = document.getElementById(`model-a-${article.id}`);
                modelAContainer.querySelector('p').textContent = 'Translating...';
                
                // Translate with Model B
                const modelBContainer = document.getElementById(`model-b-${article.id}`);
                modelBContainer.querySelector('p').textContent = 'Translating...';
                
                // Perform translations in parallel
                await Promise.all([
                    translateArticle(article, targetLanguage, modelA, 'a'),
                    translateArticle(article, targetLanguage, modelB, 'b')
                ]);
                
                // Compare translations and highlight differences
                compareAndHighlightDifferences(article.id);
            }
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
        }
    }

    // Translate a single article with specified model
    async function translateArticle(article, targetLanguage, model, modelType) {
        const modelContainer = document.getElementById(`model-${modelType}-${article.id}`);
        const modelTitle = modelContainer.querySelector('h3');
        const modelHeading = modelContainer.querySelector('h4');
        const modelContent = modelContainer.querySelector('p');
        
        // Update the title to show which language we're translating to
        modelTitle.innerHTML = `
            Translation (${config.supportedLanguages[targetLanguage]})
            <span class="model-badge">${config.languageModels[model]}</span>
        `;
        
        // Check cache first
        const cacheKey = `${targetLanguage}-${model}-${article.id}`;
        if (translationCache[cacheKey]) {
            console.log(`Using cached translation for ${cacheKey}`);
            modelHeading.textContent = translationCache[cacheKey].title;
            modelContent.innerHTML = translationCache[cacheKey].content;
            return;
        }
        
        try {
            console.log(`Translating article ${article.id} to ${targetLanguage} using ${model}`);
            
            // Validate input before sending to API
            if (!article.title || !article.content) {
                throw new Error('Invalid article data: missing title or content');
            }
            
            if (!targetLanguage || !config.supportedLanguages[targetLanguage]) {
                throw new Error('Invalid target language');
            }
            
            if (!model || !config.languageModels[model]) {
                throw new Error('Invalid translation model');
            }
            
            // Call translation API with proper error handling
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.apiKey
                },
                body: JSON.stringify({
                    articles: [article],
                    targetLanguage: targetLanguage,
                    model: model
                }),
                mode: 'cors'
            });
            
            if (!response.ok) {
                let errorMessage = `API error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // If we can't parse the error as JSON, use the status text
                    errorMessage = `API error: ${response.status} - ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            // Validate response data
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid API response format');
            }
            
            console.log('Translation successful:', data);
            
            // Cache the result
            translationCache[cacheKey] = data[0];
            
            // Display translated content
            modelHeading.textContent = data[0].title || 'Translation error';
            modelContent.innerHTML = data[0].content || 'Error: No content returned';
        } catch (error) {
            console.error(`Translation error for article ${article.id}:`, error);
            modelHeading.textContent = 'Error translating title';
            modelContent.textContent = `Error: ${error.message}`;
        }
    }

    // Compare translations and highlight differences
    function compareAndHighlightDifferences(articleId) {
        const modelAContainer = document.getElementById(`model-a-${articleId}`);
        const modelBContainer = document.getElementById(`model-b-${articleId}`);
        
        // Get the content from both models
        const modelAContent = modelAContainer.querySelector('p').innerHTML;
        const modelBContent = modelBContainer.querySelector('p').innerHTML;
        
        // Get the titles from both models
        const modelATitle = modelAContainer.querySelector('h4').textContent;
        const modelBTitle = modelBContainer.querySelector('h4').textContent;
        
        // Compare and highlight differences in titles
        const highlightedTitles = highlightDifferences(modelATitle, modelBTitle);
        modelAContainer.querySelector('h4').innerHTML = highlightedTitles.textA;
        modelBContainer.querySelector('h4').innerHTML = highlightedTitles.textB;
        
        // Compare and highlight differences in content
        const highlightedContent = highlightDifferences(modelAContent, modelBContent);
        modelAContainer.querySelector('p').innerHTML = highlightedContent.textA;
        modelBContainer.querySelector('p').innerHTML = highlightedContent.textB;
    }
    
    // Function to highlight differences between two texts
    function highlightDifferences(textA, textB) {
        // Sanitize inputs to prevent XSS
        const sanitizeHTML = (text) => {
            if (typeof text !== 'string') return '';
            return text
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        
        // Remove any existing highlight spans
        textA = (textA || '').toString().replace(/<span class="diff-highlight">|<\/span>/g, '');
        textB = (textB || '').toString().replace(/<span class="diff-highlight">|<\/span>/g, '');
        
        // Sanitize both texts
        const sanitizedTextA = sanitizeHTML(textA);
        const sanitizedTextB = sanitizeHTML(textB);
        
        // For CJK languages, we need to handle character-by-character comparison
        // Check if the text contains CJK characters
        const containsCJK = (text) => /[\u3000-\u9fff\uac00-\ud7af\u3040-\u30ff]/.test(text);
        
        let wordsA, wordsB;
        
        if (containsCJK(sanitizedTextA) || containsCJK(sanitizedTextB)) {
            // For CJK languages, split by character
            wordsA = [...sanitizedTextA];
            wordsB = [...sanitizedTextB];
        } else {
            // For other languages, split by word boundaries
            wordsA = sanitizedTextA.split(/(\s+|\b)/).filter(Boolean);
            wordsB = sanitizedTextB.split(/(\s+|\b)/).filter(Boolean);
        }
        
        // Initialize result arrays
        const resultA = [];
        const resultB = [];
        
        // Use a simple word-by-word comparison
        const maxLength = Math.max(wordsA.length, wordsB.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (i < wordsA.length && i < wordsB.length) {
                // Both texts have words at this position
                if (wordsA[i] !== wordsB[i] && !wordsA[i].match(/^\s+$/) && !wordsB[i].match(/^\s+$/)) {
                    // Words differ and are not just whitespace
                    resultA.push(`<span class="diff-highlight">${wordsA[i]}</span>`);
                    resultB.push(`<span class="diff-highlight">${wordsB[i]}</span>`);
                } else {
                    // Words are the same or are whitespace
                    resultA.push(wordsA[i]);
                    resultB.push(wordsB[i]);
                }
            } else if (i < wordsA.length) {
                // Only textA has a word at this position
                resultA.push(`<span class="diff-highlight">${wordsA[i]}</span>`);
            } else {
                // Only textB has a word at this position
                resultB.push(`<span class="diff-highlight">${wordsB[i]}</span>`);
            }
        }
        
        return {
            textA: resultA.join(''),
            textB: resultB.join('')
        };
    }

    // Add a favicon to prevent 404 errors
    function addFavicon() {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
        document.head.appendChild(link);
    }
});