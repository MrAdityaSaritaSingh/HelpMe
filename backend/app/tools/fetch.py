from newspaper import Article, Config

def extract_article(url):
    """
    Extracts the title and text from a given URL using the newspaper3k library.
    Includes a browser-like User-Agent to reduce the chance of being blocked.
    """
    try:
        # Set up a config object with a common browser user agent
        config = Config()
        config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        config.request_timeout = 10 # Add a timeout

        # Create an Article object with the specified URL and config
        article = Article(url, config=config)
        
        # Download, parse, and perform NLP
        article.download()
        article.parse()
        
        return article.title, article.text
    except Exception as e:
        print(f"Error extracting article from {url}: {e} on URL {url}")
        return None, None