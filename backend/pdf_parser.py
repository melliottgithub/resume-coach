from pymupdf import Document

def parse_file(content: bytes) -> str:
    pdf_document = Document(stream=content, filetype='pdf')
    all_text = []

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        text = page.get_text()
        all_text.append(text)

    pdf_document.close()
    return "\n".join(all_text)