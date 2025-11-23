// api/news.js - Vercel Serverless Function
// This serves the latest immigration news to your website

export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com'); // Replace with your actual domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Fetch the latest blog posts from GitHub
    const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/blog_posts.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const blogPosts = await response.json();
    
    // Return the latest posts
    res.status(200).json(blogPosts);
    
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return sample data as fallback
    const samplePost = {
      id: 'sample001',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: `Canadian Immigration Weekly Update - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      content: `
        <p>This week brings important developments in Canadian immigration.</p>
        
        <h3>Express Entry Updates</h3>
        <p>IRCC continues to conduct regular draws with competitive scores for skilled workers.</p>
        
        <h3>Provincial Programs</h3>
        <p>Several provinces have updated their nomination criteria to attract more skilled workers.</p>
        
        <h3>Student Pathways</h3>
        <p>New opportunities available for international students graduating from Canadian institutions.</p>
        
        <p>Contact Culye Immigration Services for personalized guidance on your immigration journey.</p>
      `,
      author: 'The Culye Team',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
          caption: 'Canadian landscape',
          credit: 'Unsplash'
        }
      ],
      sources: [
        {
          title: 'IRCC Official Website',
          url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
          source: 'Government of Canada'
        }
      ]
    };
    
    res.status(200).json([samplePost]);
  }
}
