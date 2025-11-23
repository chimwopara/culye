# Culye Immigration News Automation System

## 🎯 What This System Does

Automatically fetches and displays the latest Canadian immigration news on your website every Sunday night. The system:
- Fetches top 3 immigration news items weekly
- Rewrites them using AI for a human, professional tone
- Displays them beautifully on your website
- Costs less than $1/month to operate (or completely free without AI)

## 📁 Files Included

### Core Files:
- **`index.html`** - Your updated website with integrated news section
- **`news-loader-simple.js`** - Advanced news loader with API support
- **`news-loader-simple.js`** - Simple GitHub Pages version (easier setup)
- **`news_fetcher.py`** - Python script that fetches and processes news
- **`.github/workflows/update-news.yml`** - GitHub Actions automation
- **`api/news.js`** - Vercel serverless API endpoint (optional)
- **`SETUP_GUIDE.md`** - Detailed setup instructions

### Which Version to Choose?

**Option A: Simple Version (Recommended for beginners)**
- Use `news-loader-simple.js`
- Works with GitHub Pages only
- No API server needed
- Completely free

**Option B: Advanced Version**
- Use `news-loader-simple.js` + `api/news.js`
- Requires Vercel account (free tier)
- Better performance and caching
- More professional setup

## 🚀 Quick Start (5 Minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `culye-immigration-news`
3. Make it public
4. Create repository

### Step 2: Get Free API Keys
1. **NewsAPI** (Required):
   - Go to https://newsapi.org/register
   - Sign up and get your free API key

2. **DeepSeek** (Optional but recommended - $1):
   - Go to https://platform.deepseek.com
   - Sign up and add $1 credit
   - Get your API key

### Step 3: Upload Files
1. Upload all files to your new repository
2. Make sure to maintain the folder structure:
   ```
   ├── news_fetcher.py
   ├── .github/
   │   └── workflows/
   │       └── update-news.yml
   └── (other files)
   ```

### Step 4: Add Secret Keys
In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - Name: `NEWSAPI_KEY`, Value: [Your NewsAPI key]
   - Name: `DEEPSEEK_API_KEY`, Value: [Your DeepSeek key] (optional)

### Step 5: Update Your Website

**For Simple Version:**
1. Replace line 4 in `news-loader-simple.js`:
   ```javascript
   const GITHUB_NEWS_URL = 'https://raw.githubusercontent.com/[YOUR-GITHUB-USERNAME]/culye-immigration-news/main/blog_posts.json';
   ```

2. In your main website, change the script reference:
   ```html
   <script src="news-loader-simple.js"></script>
   ```

**For Advanced Version:**
Follow the detailed instructions in `SETUP_GUIDE.md`

### Step 6: Test It!
1. Go to your repository → Actions tab
2. Click "Update Immigration News" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 1-2 minutes
5. Check your website - news should appear!

## 💰 Cost Breakdown

### Free Option:
- Uses NewsAPI free tier
- No AI rewriting (simple reformatting)
- **Total: $0/month**

### With AI Option:
- DeepSeek AI for professional rewriting
- ~2000 tokens per week = ~$0.001
- **Total: <$0.50/month**

## 🎨 Customization

### Change Update Frequency:
Edit `.github/workflows/update-news.yml`:
```yaml
# Current: Sundays at 9 PM MST (Edmonton time)
- cron: '0 4 * * 1'

# Daily at midnight:
- cron: '0 0 * * *'

# Twice per week:
- cron: '0 4 * * 1,4'
```

### Modify News Section Style:
The news section uses Tailwind CSS classes. Edit the HTML in `index.html` to change:
- Colors (bg-gray-800, text-blue-400, etc.)
- Spacing (py-20, px-8, etc.)
- Layout (grid-cols-3, etc.)

### Change News Sources:
Edit `news_fetcher.py` to:
- Add more keywords in the search query
- Include specific Canadian news RSS feeds
- Filter by different topics

## 📧 Support & Troubleshooting

### Common Issues:

**News not appearing:**
- Check GitHub Actions logs for errors
- Verify API keys are set correctly
- Clear browser cache and reload

**Old news showing:**
- Verify GitHub Action ran successfully
- Check if `blog_posts.json` exists in your repository
- Make sure JavaScript file URLs are correct

**"Unable to Load News" error:**
- Check browser console for errors (F12)
- Verify GitHub repository is public
- Check URL in news-loader-simple.js is correct

## 🔒 Security Notes

- Never commit API keys directly to files
- Always use GitHub Secrets
- Keep your repository public for GitHub Pages to work
- API keys are never exposed to website visitors

## 📱 Mobile Responsive

The news section is fully responsive:
- Desktop: 3-column grid
- Tablet: 2-column grid  
- Mobile: Single column stack

## 🌟 Features

✅ Automatic weekly updates
✅ AI-powered content rewriting
✅ Professional images from Unsplash
✅ Source citations
✅ Mobile responsive
✅ Dark theme design
✅ Loading states
✅ Error handling
✅ SEO friendly

## 🚦 Next Steps

1. Set up the basic system first
2. Test it works with manual trigger
3. Wait for Sunday night for automatic update
4. Monitor for a few weeks
5. Consider adding email notifications

## 📄 License

This system is provided for Culye Immigration Services. Feel free to modify as needed.

---

**Need help?** The system is designed to be self-sufficient, but if you encounter issues:
1. Check the `SETUP_GUIDE.md` for detailed instructions
2. Review GitHub Actions logs for error messages
3. Test each component individually
4. Ensure all API services have active keys/credit

Good luck with your automated immigration news system!
