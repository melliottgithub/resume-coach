from bs4 import BeautifulSoup, NavigableString, Tag
from datetime import datetime

def parse_row(row, headers):
    html = row[headers.index("Job Description")]
    last_updated_timestamp = datetime.strptime(
        row[headers.index("Crawl Timestamp")],
        "%Y-%m-%d %H:%M:%S%z"
    )
    return {
        'id': row[headers.index("Uniq Id")],
        'company': row[headers.index("Company Name")],
        'job_title': row[headers.index("Job Title")],
        'country': row[headers.index("Country")],
        'city': row[headers.index("City")],
        'state': row[headers.index("State")],
        'location': row[headers.index("Location")],
        'last_updated': last_updated_timestamp,
        'apply_url': row[headers.index("Apply Url")],
    }, html
    
def convert_tag_to_markdown(tag, markdown_lines, list_prefix=""):
    """
    Recursively convert HTML tags to Markdown.
    
    :param tag: BeautifulSoup Tag object
    :param markdown_lines: List to append markdown lines
    :param list_prefix: Prefix for list items (for nested lists)
    """
    if isinstance(tag, NavigableString):
        text = tag.strip()
        if text:
            markdown_lines.append(text)
        return

    if not isinstance(tag, Tag):
        return

    if tag.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        level = int(tag.name[1])
        prefix = '#' * level + ' '
        markdown_lines.append(prefix + tag.get_text(strip=True))
        markdown_lines.append('\n')  # Add a blank line

    elif tag.name == 'p':
        text = tag.get_text(strip=True)
        if text:
            markdown_lines.append(text)
            markdown_lines.append('\n')  # Add a blank line

    elif tag.name == 'b' or tag.name == 'strong':
        markdown_lines.append(f"**{tag.get_text(strip=True)}**")

    elif tag.name == 'ul':
        for li in tag.find_all('li', recursive=False):
            convert_tag_to_markdown(li, markdown_lines, list_prefix + "  ")
        markdown_lines.append('\n')  # Add a blank line after list

    elif tag.name == 'li':
        line_prefix = f"\n{list_prefix}- "
        item_lines = []
        for child in tag.children:
            convert_tag_to_markdown(child, item_lines, list_prefix + "  ")
        item_text = ' '.join(item_lines).strip()
        markdown_lines.append(f"{line_prefix}{item_text}")

    elif tag.name == 'br':
        markdown_lines.append('\n\n')  # Markdown line break

    elif tag.name == 'div':
        for child in tag.children:
            convert_tag_to_markdown(child, markdown_lines, list_prefix)

    else:
        # For other tags, process their children
        for child in tag.children:
            convert_tag_to_markdown(child, markdown_lines, list_prefix)

def html_to_markdown(html_content):
    """
    Convert HTML content to Markdown.
    
    :param html_content: String containing HTML
    :return: String containing Markdown
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    markdown_lines = []

    # Start processing from the main div with id 'jobDescriptionText'
    main_div = soup.find('div', id='jobDescriptionText')
    if not main_div:
        print("Main div with id 'jobDescriptionText' not found.")
        return ""

    for child in main_div.children:
        convert_tag_to_markdown(child, markdown_lines)

    # Join the lines into a single Markdown string
    markdown = '\n'.join(markdown_lines)
    
    # Clean up multiple blank lines
    while '\n\n\n' in markdown:
        markdown = markdown.replace('\n\n\n', '\n\n')

    return markdown.strip()