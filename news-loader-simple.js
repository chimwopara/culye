// Simple News Loader for GitHub Pages
// This version fetches news directly from GitHub without needing an API server

const GITHUB_NEWS_URL = 'https://raw.githubusercontent.com/chimwopara/culye/main/blog_posts.json';

// Auto-initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNews);
} else {
    loadNews();
}

async function loadNews() {
    const newsSection = document.getElementById('news-content');
    const loadingSection = document.getElementById('news-loading');
    const errorSection = document.getElementById('news-error');
    
    if (!newsSection) return; // Exit if news section doesn't exist
    
    try {
        // Show loading state
        if (loadingSection) loadingSection.style.display = 'block';
        if (newsSection) newsSection.style.display = 'none';
        if (errorSection) errorSection.style.display = 'none';
        
        // Fetch news from GitHub
        const response = await fetch(GITHUB_NEWS_URL + '?t=' + Date.now()); // Cache bypass
        
        let newsData;
        if (response.ok) {
            newsData = await response.json();
        } else {
            // Use embedded fallback data
            newsData = getEmbeddedNews();
        }
        
        // Display the news
        if (newsData && newsData.length > 0) {
            renderNews(newsData[0]); // Show latest post
        }
        
        // Show content, hide loading
        if (loadingSection) loadingSection.style.display = 'none';
        if (newsSection) newsSection.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading news:', error);
        
        // Try to show embedded content as fallback
        try {
            const fallbackData = getEmbeddedNews();
            renderNews(fallbackData[0]);
            if (loadingSection) loadingSection.style.display = 'none';
            if (newsSection) newsSection.style.display = 'block';
        } catch (fallbackError) {
            // Show error state only if everything fails
            if (loadingSection) loadingSection.style.display = 'none';
            if (errorSection) errorSection.style.display = 'block';
        }
    }
}

function renderNews(post) {
    // Update featured article
    const featuredContainer = document.querySelector('#featured-article');
    if (featuredContainer) {
        const mainImage = post.images && post.images[0] ? post.images[0] : {
            url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
            caption: 'Canadian Immigration',
            credit: 'Stock Photo'
        };
        
        featuredContainer.innerHTML = `
            <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div class="relative">
                    <img src="${mainImage.url}" 
                         alt="${mainImage.caption}" 
                         class="w-full h-96 object-cover"
                         onerror="this.src='https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-8">
                        <div class="flex items-center space-x-4 mb-4">
                            <span class="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full text-xs font-semibold text-blue-400">
                                Weekly Update
                            </span>
                            <span class="text-gray-300 text-sm">${post.date}</span>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">${post.title}</h3>
                        <p class="text-gray-300 text-sm">By ${post.author}</p>
                    </div>
                </div>
                <div class="p-8">
                    <div class="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                        ${formatBlogContent(post.content)}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update news grid cards
    const gridContainer = document.querySelector('#news-grid');
    if (gridContainer && post.images && post.images.length > 1) {
        const cards = post.images.slice(1, 4).map((img, idx) => `
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                <img src="${img.url}" 
                     alt="${img.caption}"
                     class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                     onerror="this.src='https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80'">
                <div class="p-6">
                    <h4 class="text-lg font-bold text-white mb-2">
                        ${['Express Entry', 'Provincial Programs', 'Student Pathways'][idx] || 'Immigration Update'}
                    </h4>
                    <a href="#contact" class="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                        Learn More →
                    </a>
                </div>
            </div>
        `).join('');
        gridContainer.innerHTML = cards;
    }
    
    // Update sources
    const sourcesContainer = document.querySelector('#sources-list');
    if (sourcesContainer && post.sources) {
        const sourceLinks = post.sources.map(src => `
            <a href="${src.url}" target="_blank" rel="noopener" 
               class="flex items-center justify-between p-2 rounded hover:bg-gray-700/50 transition group">
                <span class="text-gray-300 text-sm">${src.title}</span>
                <span class="text-gray-500 text-xs">${src.source}</span>
            </a>
        `).join('');
        sourcesContainer.innerHTML = sourceLinks;
    }
}

function formatBlogContent(content) {
    // Simple markdown to HTML conversion
    return content
        .split('\n\n')
        .map(para => {
            if (para.startsWith('###')) {
                return `<h3 class="text-xl font-bold text-white mt-6 mb-3">${para.replace('###', '').trim()}</h3>`;
            } else if (para.startsWith('##')) {
                return `<h3 class="text-xl font-bold text-white mt-6 mb-3">${para.replace('##', '').trim()}</h3>`;
            } else if (para.trim()) {
                return `<p class="mb-4">${para
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
                }</p>`;
            }
            return '';
        })
        .join('');
}

function getEmbeddedNews() {
    // Fallback news data embedded in the script
    return [{
        id: 'embedded',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'Canadian Immigration Weekly Update',
        author: 'The Culye Team',
        content: `Welcome to this week's Canadian immigration update, where we bring you the latest developments that could impact your journey to Canada.

### Express Entry System Updates

Immigration, Refugees and Citizenship Canada (IRCC) continues to conduct regular Express Entry draws, maintaining competitive scores for skilled workers. Recent draws have shown a focus on candidates with French language proficiency and those in healthcare occupations, reflecting Canada's current immigration priorities. The minimum Comprehensive Ranking System (CRS) scores have remained stable, offering consistent opportunities for qualified candidates.

### Provincial Nominee Programs

Several provinces have announced updates to their nomination programs this week. Alberta has expanded its Accelerated Tech Pathway to include additional in-demand occupations in the technology sector. British Columbia has reduced score requirements for healthcare professionals, recognizing the critical need for medical workers. Ontario continues its targeted approach, conducting draws specifically for skilled trades workers in construction and manufacturing sectors. These provincial programs offer excellent pathways for candidates who may not meet Express Entry requirements directly.

### International Student Opportunities

IRCC has introduced enhanced pathways for international students graduating from Canadian institutions. New measures include extended post-graduation work permits for students in high-demand fields such as healthcare, STEM, and skilled trades. The government has also streamlined the permanent residence application process for international graduates with Canadian work experience. These changes acknowledge the valuable contribution international students make to Canada's economy and society, providing clearer pathways from study to permanent residence.

### What This Means for You

These updates underscore the dynamic nature of Canadian immigration policies and the government's commitment to attracting skilled talent from around the world. Whether you're a skilled professional, a recent graduate, or someone with specialized expertise, there are multiple pathways available to make Canada your new home. Staying informed about these changes is crucial for maximizing your chances of success.

The current trends suggest that candidates with French language skills, healthcare backgrounds, or technology expertise have particularly strong opportunities. However, Canada's diverse immigration programs mean that there are pathways for candidates from various backgrounds and skill sets.

If you're considering immigration to Canada or need guidance on how these updates affect your specific situation, our team at Culye Immigration Services is here to help. We provide personalized assessments to identify the best immigration pathway for your unique circumstances and guide you through every step of the application process.

Contact us today for a comprehensive evaluation of your immigration options and let us help you navigate your journey to Canada with confidence.`,
        images: [
            {
                url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
                caption: 'Canadian Rockies',
                credit: 'Unsplash'
            },
            {
                url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80',
                caption: 'Toronto Skyline',
                credit: 'Unsplash'
            },
            {
                url: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=600&q=80',
                caption: 'Canadian Flag',
                credit: 'Unsplash'
            }
        ],
        sources: [
            {
                title: 'Express Entry Rounds of Invitations',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html',
                source: 'IRCC'
            },
            {
                title: 'Provincial Nominee Program',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html',
                source: 'Government of Canada'
            },
            {
                title: 'Study in Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
                source: 'IRCC'
            }
        ]
    }];
}
