
from newspaper import Article

def extract_article(url):
    """
    Extracts the main text from a given URL.
    """
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.title, article.text
    except Exception as e:
        print(f"Error extracting article from {url}: {e}")
        return None, None
