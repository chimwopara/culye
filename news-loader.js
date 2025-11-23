// Immigration News Loader
// Fetches and displays the latest immigration news from the API/JSON endpoint

// Configuration
const NEWS_API_ENDPOINT = '/api/news'; // This will be your API endpoint
const FALLBACK_NEWS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/blog_posts.json';

// Initialize news loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadImmigrationNews();
});

async function loadImmigrationNews() {
    const loadingEl = document.getElementById('news-loading');
    const contentEl = document.getElementById('news-content');
    const errorEl = document.getElementById('news-error');
    
    // Show loading state
    loadingEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    
    try {
        // Try to fetch news from your API endpoint
        let newsData = await fetchNewsFromAPI();
        
        // If no data from API, try fallback
        if (!newsData || newsData.length === 0) {
            newsData = await fetchNewsFromFallback();
        }
        
        // If still no data, use sample data
        if (!newsData || newsData.length === 0) {
            newsData = getSampleNews();
        }
        
        // Display the news
        displayNews(newsData);
        
        // Hide loading, show content
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading news:', error);
        
        // Show error state
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

async function fetchNewsFromAPI() {
    try {
        const response = await fetch(NEWS_API_ENDPOINT);
        if (response.ok) {
            const data = await response.json();
            // If data is an array, take the first item (latest post)
            return Array.isArray(data) ? data : [data];
        }
    } catch (error) {
        console.log('API fetch failed, trying fallback...');
    }
    return null;
}

async function fetchNewsFromFallback() {
    try {
        const response = await fetch(FALLBACK_NEWS_URL);
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [data];
        }
    } catch (error) {
        console.log('Fallback fetch failed, using sample data...');
    }
    return null;
}

function getSampleNews() {
    // Sample news data for demonstration
    return [{
        id: 'sample001',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: `Canadian Immigration Weekly Update - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        content: `
            <p>This week brings exciting developments in Canadian immigration that could impact your journey to Canada.</p>
            
            <h3>Express Entry Draw Results</h3>
            <p>Immigration, Refugees and Citizenship Canada (IRCC) conducted its latest Express Entry draw this week, inviting candidates with scores above 480 to apply for permanent residence. This represents a positive trend for skilled workers looking to make Canada their home. The draw focused on candidates with French language proficiency and those in healthcare occupations, reflecting Canada's current immigration priorities.</p>
            
            <h3>Provincial Nominee Program Updates</h3>
            <p>Several provinces have updated their nomination criteria this week. Alberta has expanded its tech pathway to include additional occupations, while British Columbia has lowered the score requirements for healthcare professionals. Ontario continues to prioritize skilled trades workers, conducting targeted draws for construction and manufacturing sectors.</p>
            
            <h3>New Pathways for International Students</h3>
            <p>IRCC announced enhanced pathways for international students graduating from Canadian institutions. The new measures include extended post-graduation work permits for students in high-demand fields and streamlined permanent residence applications for those with Canadian work experience. These changes recognize the valuable contribution international students make to Canada's economy and society.</p>
            
            <p>These updates highlight the dynamic nature of Canadian immigration policies and the government's commitment to attracting skilled talent. Whether you're a skilled worker, student, or entrepreneur, staying informed about these changes is crucial for planning your immigration strategy.</p>
            
            <p>If you're considering immigration to Canada or need guidance on how these updates affect your case, our team at Culye Immigration Services is here to help. Contact us for a personalized assessment of your immigration options.</p>
        `,
        author: 'The Culye Team',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
                caption: 'Canadian Rockies landscape',
                credit: 'Photo by Unsplash'
            },
            {
                url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80',
                caption: 'Toronto skyline',
                credit: 'Photo by Unsplash'
            },
            {
                url: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800&q=80',
                caption: 'Students in Canada',
                credit: 'Photo by Unsplash'
            }
        ],
        sources: [
            {
                title: 'Latest Express Entry Draw Results',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
                source: 'IRCC Official'
            },
            {
                title: 'Provincial Nominee Program Updates',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html',
                source: 'Government of Canada'
            },
            {
                title: 'International Student Pathways',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
                source: 'IRCC'
            }
        ]
    }];
}

function displayNews(newsData) {
    if (!newsData || newsData.length === 0) return;
    
    const latestPost = newsData[0]; // Get the most recent post
    
    // Display featured article
    displayFeaturedArticle(latestPost);
    
    // Display news cards
    displayNewsCards(latestPost);
    
    // Display sources
    displaySources(latestPost.sources || []);
}

function displayFeaturedArticle(post) {
    const featuredEl = document.getElementById('featured-article');
    
    // Find the main image
    const mainImage = post.images && post.images.length > 0 ? post.images[0] : {
        url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
        caption: 'Canadian landscape',
        credit: 'Stock Photo'
    };
    
    featuredEl.innerHTML = `
        <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div class="aspect-w-16 aspect-h-9 relative">
                <img src="${mainImage.url}" alt="${mainImage.caption}" 
                     class="w-full h-96 object-cover"
                     onerror="this.src='https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-8">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full text-xs font-semibold text-blue-400">
                            Latest Update
                        </span>
                        <span class="text-gray-300 text-sm">${post.date}</span>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">${post.title}</h3>
                    <p class="text-gray-300 text-sm">By ${post.author}</p>
                </div>
            </div>
            <div class="p-8">
                <div class="prose prose-invert max-w-none text-gray-300 leading-relaxed news-content">
                    ${formatContent(post.content)}
                </div>
            </div>
        </div>
    `;
}

function displayNewsCards(post) {
    const gridEl = document.getElementById('news-grid');
    
    // Create cards for each image/section
    if (post.images && post.images.length > 1) {
        const cards = post.images.slice(1, 4).map((image, index) => {
            const topics = [
                'Express Entry Updates',
                'Provincial Programs',
                'Student Pathways'
            ];
            
            const descriptions = [
                'Latest draw results and score requirements for skilled workers applying through Express Entry.',
                'Provincial nomination updates from Alberta, British Columbia, and Ontario for various occupations.',
                'New opportunities for international students including extended work permits and PR pathways.'
            ];
            
            return `
                <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                    <div class="aspect-w-16 aspect-h-9 relative overflow-hidden">
                        <img src="${image.url}" alt="${image.caption}" 
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                             onerror="this.src='https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=80'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <h4 class="text-lg font-bold text-white mb-2">${topics[index] || 'Immigration Update'}</h4>
                        <p class="text-gray-400 text-sm mb-4">${descriptions[index] || 'Important updates for your immigration journey to Canada.'}</p>
                        <a href="#contact" class="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                            Learn More
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
        
        gridEl.innerHTML = cards;
    } else {
        // Display generic cards if no images
        gridEl.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div class="text-blue-500 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h4 class="text-lg font-bold text-white mb-2">Express Entry</h4>
                <p class="text-gray-400 text-sm">Latest draw results and trends for skilled immigration.</p>
            </div>
            <div class="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div class="text-green-500 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                </div>
                <h4 class="text-lg font-bold text-white mb-2">Provincial Programs</h4>
                <p class="text-gray-400 text-sm">Updates from provinces seeking skilled workers.</p>
            </div>
            <div class="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div class="text-purple-500 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h4 class="text-lg font-bold text-white mb-2">Study & Work</h4>
                <p class="text-gray-400 text-sm">Opportunities for international students and workers.</p>
            </div>
        `;
    }
}

function displaySources(sources) {
    const sourcesEl = document.getElementById('sources-list');
    
    if (sources && sources.length > 0) {
        const sourceLinks = sources.map(source => `
            <a href="${source.url}" target="_blank" rel="noopener noreferrer" 
               class="flex items-center justify-between p-2 rounded hover:bg-gray-700/50 transition-colors group">
                <div class="flex items-center space-x-3">
                    <svg class="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <span class="text-gray-300 text-sm">${source.title}</span>
                </div>
                <span class="text-gray-500 text-xs">${source.source}</span>
            </a>
        `).join('');
        
        sourcesEl.innerHTML = sourceLinks;
    } else {
        sourcesEl.innerHTML = `
            <p class="text-gray-500 text-sm">Sources will be updated with the next news refresh.</p>
        `;
    }
}

function formatContent(content) {
    // Convert markdown-style formatting to HTML
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// Add styles for news content
const style = document.createElement('style');
style.textContent = `
    .news-content h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: white;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }
    
    .news-content p {
        margin-bottom: 1rem;
        line-height: 1.75;
    }
    
    .news-content a {
        color: #60a5fa;
        text-decoration: underline;
    }
    
    .news-content a:hover {
        color: #93bbfc;
    }
`;
document.head.appendChild(style);
