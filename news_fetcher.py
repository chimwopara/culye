#!/usr/bin/env python3
"""
Canadian Immigration News Fetcher and Processor
Fetches latest immigration news and rewrites them using DeepSeek API
"""

import os
import json
import requests
from datetime import datetime, timedelta
import hashlib
from typing import List, Dict
import re
import time

# Configuration
NEWSAPI_KEY = os.environ.get('NEWSAPI_KEY')  # Get free key from newsapi.org
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')  # For free stock photos

def fetch_immigration_news() -> List[Dict]:
    """Fetch latest Canadian immigration news from multiple sources"""
    
    news_items = []
    
    # NewsAPI.org (free tier: 100 requests/day)
    if NEWSAPI_KEY:
        try:
            # Search for Canadian immigration news
            params = {
                'apiKey': NEWSAPI_KEY,
                'q': 'Canada immigration OR "Canadian immigration" OR "immigrate to Canada" OR IRCC',
                'language': 'en',
                'sortBy': 'publishedAt',
                'from': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'pageSize': 10
            }
            
            response = requests.get('https://newsapi.org/v2/everything', params=params)
            if response.status_code == 200:
                data = response.json()
                for article in data.get('articles', [])[:5]:
                    if article.get('title') and article.get('url'):
                        news_items.append({
                            'title': article['title'],
                            'url': article['url'],
                            'source': article.get('source', {}).get('name', 'Unknown'),
                            'description': article.get('description', ''),
                            'publishedAt': article.get('publishedAt', ''),
                            'image': article.get('urlToImage', '')
                        })
        except Exception as e:
            print(f"NewsAPI error: {e}")
    
    # Fallback: Web scraping from Canada.ca RSS feed (free)
    try:
        # IRCC News RSS Feed
        rss_url = 'https://www.canada.ca/en/immigration-refugees-citizenship/news.atom.xml'
        response = requests.get(rss_url, timeout=10)
        if response.status_code == 200:
            # Simple XML parsing for RSS/Atom feed
            content = response.text
            entries = re.findall(r'<entry>(.*?)</entry>', content, re.DOTALL)
            
            for entry in entries[:5]:
                title_match = re.search(r'<title[^>]*>(.*?)</title>', entry)
                link_match = re.search(r'<link[^>]*href="([^"]+)"', entry)
                summary_match = re.search(r'<summary[^>]*>(.*?)</summary>', entry)
                published_match = re.search(r'<published>(.*?)</published>', entry)
                
                if title_match and link_match:
                    news_items.append({
                        'title': title_match.group(1).strip(),
                        'url': link_match.group(1).strip(),
                        'source': 'IRCC Official',
                        'description': summary_match.group(1).strip() if summary_match else '',
                        'publishedAt': published_match.group(1).strip() if published_match else datetime.now().isoformat(),
                        'image': ''
                    })
    except Exception as e:
        print(f"RSS feed error: {e}")
    
    # Remove duplicates and sort by date
    seen_urls = set()
    unique_news = []
    for item in news_items:
        if item['url'] not in seen_urls:
            seen_urls.add(item['url'])
            unique_news.append(item)
    
    # Sort by publication date
    unique_news.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
    
    return unique_news[:3]  # Return top 3 latest news

def fetch_image_for_topic(topic: str) -> str:
    """Fetch a relevant image from Unsplash"""
    if not UNSPLASH_ACCESS_KEY:
        # Return a default Canada-themed image URL
        return "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80"
    
    try:
        params = {
            'query': f'Canada {topic}',
            'per_page': 1,
            'orientation': 'landscape'
        }
        headers = {
            'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'
        }
        
        response = requests.get('https://api.unsplash.com/search/photos', 
                              params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('results'):
                photo = data['results'][0]
                # Return medium-sized image with attribution
                return {
                    'url': photo['urls']['regular'],
                    'credit': f"{photo['user']['name']} on Unsplash",
                    'link': photo['links']['html']
                }
    except Exception as e:
        print(f"Unsplash error: {e}")
    
    # Fallback images
    fallbacks = [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",  # Canadian mountains
        "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80",  # Toronto skyline
        "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=800&q=80"   # Canadian flag
    ]
    
    # Use hash to consistently select same image for same topic
    index = int(hashlib.md5(topic.encode()).hexdigest(), 16) % len(fallbacks)
    return fallbacks[index]

def rewrite_with_deepseek(news_items: List[Dict]) -> Dict:
    """Use DeepSeek API to rewrite news as a cohesive blog post"""
    
    if not DEEPSEEK_API_KEY:
        # Fallback: Create simple summary without AI
        return create_fallback_blog(news_items)
    
    # Prepare news summary for DeepSeek
    news_summary = ""
    for i, item in enumerate(news_items, 1):
        news_summary += f"{i}. {item['title']}\n"
        news_summary += f"   Source: {item['source']}\n"
        news_summary += f"   Summary: {item['description']}\n"
        news_summary += f"   URL: {item['url']}\n\n"
    
    prompt = f"""You are writing a weekly immigration news update for Culye Immigration Services. 
    
Here are this week's top 3 Canadian immigration news stories:

{news_summary}

Write a brief, informative blog post (300-400 words) that:
1. Introduces the week's immigration updates naturally
2. Discusses each news item with key takeaways for potential immigrants
3. Provides practical insights on what these changes mean
4. Maintains a professional yet approachable tone
5. Ends with a brief call-to-action for consultation

Important writing style:
- Sound natural and human, avoid phrases that sound robotic
- Use varied sentence structures
- Include specific details from the news
- Write in a conversational but professional tone
- Do NOT use em dashes or excessive punctuation
- Keep paragraphs flowing naturally
- Make it sound like it was written by immigration consultants who care

Remember to cite each source naturally within the text."""
    
    try:
        # DeepSeek API call
        headers = {
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'system', 'content': 'You are a professional immigration consultant writing weekly updates for clients.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 800
        }
        
        response = requests.post('https://api.deepseek.com/v1/chat/completions',
                                headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            blog_content = result['choices'][0]['message']['content']
            
            # Create blog post with metadata
            blog_post = {
                'id': hashlib.md5(f"{datetime.now().isoformat()}".encode()).hexdigest()[:8],
                'date': datetime.now().strftime('%B %d, %Y'),
                'title': f"Canadian Immigration Weekly Update - {datetime.now().strftime('%B %d, %Y')}",
                'content': blog_content,
                'sources': [{'title': item['title'], 'url': item['url'], 'source': item['source']} 
                           for item in news_items],
                'author': 'The Culye Team',
                'images': []
            }
            
            # Add images for each news item
            for item in news_items:
                if item.get('image'):
                    blog_post['images'].append({
                        'url': item['image'],
                        'caption': item['title'],
                        'credit': item['source']
                    })
                else:
                    # Fetch stock image
                    topic = item['title'].split('-')[0] if '-' in item['title'] else item['title'][:30]
                    image_data = fetch_image_for_topic(topic)
                    if isinstance(image_data, dict):
                        blog_post['images'].append(image_data)
                    else:
                        blog_post['images'].append({
                            'url': image_data,
                            'caption': item['title'],
                            'credit': 'Stock Photo'
                        })
            
            return blog_post
            
    except Exception as e:
        print(f"DeepSeek API error: {e}")
        return create_fallback_blog(news_items)

def create_fallback_blog(news_items: List[Dict]) -> Dict:
    """Create a simple blog post without AI"""
    
    content = f"""This week brings several important updates in Canadian immigration that could affect your journey to Canada.

"""
    
    for i, item in enumerate(news_items, 1):
        content += f"**Update {i}: {item['title']}**\n\n"
        content += f"{item['description'] or 'Click the source link for full details.'} "
        content += f"(Source: [{item['source']}]({item['url']}))\n\n"
    
    content += """These updates highlight the dynamic nature of Canadian immigration policies. Whether you're planning to study, work, or permanently settle in Canada, staying informed about these changes is crucial for your application success.

If you're considering immigration to Canada or need guidance on how these updates affect your case, our team at Culye Immigration Services is here to help. Contact us for a personalized assessment of your immigration options."""
    
    blog_post = {
        'id': hashlib.md5(f"{datetime.now().isoformat()}".encode()).hexdigest()[:8],
        'date': datetime.now().strftime('%B %d, %Y'),
        'title': f"Canadian Immigration Weekly Update - {datetime.now().strftime('%B %d, %Y')}",
        'content': content,
        'sources': [{'title': item['title'], 'url': item['url'], 'source': item['source']} 
                   for item in news_items],
        'author': 'The Culye Team',
        'images': []
    }
    
    # Add placeholder images
    for item in news_items:
        blog_post['images'].append({
            'url': item.get('image', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80'),
            'caption': item['title'],
            'credit': item['source']
        })
    
    return blog_post

def save_blog_post(blog_post: Dict):
    """Save blog post to JSON file for website to fetch"""
    
    # Load existing posts
    try:
        with open('blog_posts.json', 'r') as f:
            posts = json.load(f)
    except:
        posts = []
    
    # Add new post to beginning
    posts.insert(0, blog_post)
    
    # Keep only last 10 posts
    posts = posts[:10]
    
    # Save updated posts
    with open('blog_posts.json', 'w') as f:
        json.dump(posts, f, indent=2)
    
    print(f"Blog post saved: {blog_post['title']}")
    
    # Also save as latest post for easy access
    with open('latest_post.json', 'w') as f:
        json.dump(blog_post, f, indent=2)

def main():
    """Main execution function"""
    print("Starting Canadian Immigration News Fetcher...")
    
    # Fetch news
    news_items = fetch_immigration_news()
    
    if not news_items:
        print("No news items found")
        return
    
    print(f"Found {len(news_items)} news items")
    
    # Process with DeepSeek
    blog_post = rewrite_with_deepseek(news_items)
    
    # Save blog post
    save_blog_post(blog_post)
    
    print("Process completed successfully!")

if __name__ == "__main__":
    main()
