# Immigration News Automation Setup Guide

## Overview
This system automatically fetches Canadian immigration news every Sunday night, rewrites it using DeepSeek AI, and displays it on your website. The entire setup uses free or very cheap services.

## Architecture
- **News Fetching**: Python script using free news APIs
- **AI Rewriting**: DeepSeek V3.2-Exp API (cheapest option)
- **Automation**: GitHub Actions (free)
- **Storage**: GitHub repository (free)
- **API Endpoint**: Vercel (free tier) or GitHub Pages
- **Image Sources**: Unsplash API (free tier)

## Setup Steps

### 1. Create Accounts & Get API Keys

#### Required (Free):
1. **GitHub Account**: https://github.com
2. **NewsAPI.org**: 
   - Sign up at https://newsapi.org
   - Get your free API key (100 requests/day)
   
#### Optional but Recommended:
3. **DeepSeek API**:
   - Sign up at https://platform.deepseek.com
   - Add $1-5 credit (will last months with these rates)
   - Get your API key
   
4. **Unsplash API** (for better images):
   - Sign up at https://unsplash.com/developers
   - Create an app and get access key (50 requests/hour free)

5. **Vercel** (for API hosting):
   - Sign up at https://vercel.com
   - Connect your GitHub account

### 2. Repository Setup

1. Create a new GitHub repository named `culye-immigration-news`

2. Upload these files to your repository:
   ```
   /
   ├── news_fetcher.py
   ├── .github/
   │   └── workflows/
   │       └── update-news.yml
   ├── api/
   │   └── news.js
   ├── blog_posts.json (will be auto-created)
   └── README.md
   ```

3. Add your website files:
   ```
   ├── index.html
   ├── index.css
   ├── main.js
   └── news-loader.js
   ```

### 3. Configure GitHub Secrets

In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `NEWSAPI_KEY`: Your NewsAPI.org key
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key (optional)
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash key (optional)

### 4. Update Configuration Files

#### In `news-loader.js`:
Replace these placeholders:
```javascript
const NEWS_API_ENDPOINT = 'https://your-vercel-app.vercel.app/api/news';
const FALLBACK_NEWS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/culye-immigration-news/main/blog_posts.json';
```

#### In `api/news.js`:
Replace:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://culyeimmigration.com');
const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/culye-immigration-news/main/blog_posts.json');
```

### 5. Deploy to Vercel (Option A - Recommended)

1. Connect your GitHub repo to Vercel
2. Deploy the project
3. Your API will be available at: `https://your-app.vercel.app/api/news`
4. Update the `NEWS_API_ENDPOINT` in your website

### 6. Alternative: GitHub Pages Only (Option B - Simpler)

If you don't want to use Vercel:

1. Enable GitHub Pages in your repository settings
2. Your news JSON will be available at:
   `https://YOUR_USERNAME.github.io/culye-immigration-news/blog_posts.json`
3. Update `news-loader.js` to fetch directly from this URL

## Testing

### Manual Test:
1. Go to your repository's Actions tab
2. Select "Update Immigration News" workflow
3. Click "Run workflow" → "Run workflow"
4. Check if `blog_posts.json` is created/updated

### Test on Your Website:
1. Open browser console
2. Run: `loadImmigrationNews()`
3. Check if news appears correctly

## Cost Breakdown

### Completely Free Option:
- NewsAPI.org: Free (100 requests/day)
- GitHub: Free
- GitHub Actions: Free (2000 minutes/month)
- Vercel: Free tier
- No AI rewriting (uses simple reformatting)

**Monthly Cost: $0**

### With AI Rewriting (Recommended):
- All above services: Free
- DeepSeek API: ~$0.10-0.50/month
  - Input: $0.028 per 1M tokens
  - Output: $0.42 per 1M tokens
  - Weekly usage: ~2000 tokens = ~$0.001 per week

**Monthly Cost: < $1**

## Maintenance

### Weekly Monitoring:
- Check GitHub Actions tab for successful runs
- Verify news updates on your website

### Monthly Tasks:
- Review API usage to ensure within free limits
- Check DeepSeek credit balance (if using)
- Update news sources if needed

### Troubleshooting:

**No news appearing:**
1. Check GitHub Actions logs for errors
2. Verify API keys are correctly set
3. Check browser console for JavaScript errors

**Old news showing:**
1. Clear browser cache
2. Check if GitHub Action is running
3. Verify `blog_posts.json` is updating

**API rate limits:**
- NewsAPI: Max 100 requests/day
- Unsplash: Max 50 requests/hour
- DeepSeek: Based on your credit

## Customization Options

### Change Update Schedule:
Edit `.github/workflows/update-news.yml`:
```yaml
- cron: '0 4 * * 1'  # Current: Monday 4 AM UTC
# Examples:
# Daily at midnight: '0 0 * * *'
# Twice weekly: '0 4 * * 1,4'
```

### Modify News Sources:
Edit `news_fetcher.py`:
- Add more RSS feeds
- Include specific Canadian news sites
- Filter by specific keywords

### Styling Changes:
Edit the blog section in `index.html` and styles in `news-loader.js`

## Security Notes

1. **Never commit API keys** directly to your repository
2. Always use GitHub Secrets for sensitive data
3. Restrict CORS in `api/news.js` to your domain only
4. Consider rate limiting if traffic increases

## Support

For issues or questions:
1. Check GitHub Actions logs for errors
2. Review browser console for JavaScript issues
3. Ensure all API keys are valid and have credit
4. Test each component individually

## Future Enhancements

Consider adding:
- Email newsletter integration
- Social media auto-posting
- Multiple language support
- Advanced analytics
- Comment system
- RSS feed generation

---

## Quick Start Checklist

- [ ] Create GitHub repository
- [ ] Get NewsAPI.org key
- [ ] Get DeepSeek API key (optional)
- [ ] Upload all files to repository
- [ ] Configure GitHub Secrets
- [ ] Deploy to Vercel or enable GitHub Pages
- [ ] Update URLs in JavaScript files
- [ ] Test manual workflow run
- [ ] Verify news appears on website

Once everything is set up, your website will automatically update with fresh, AI-rewritten Canadian immigration news every Sunday night!
