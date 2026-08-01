from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

CONTRACT_KEYWORDS = [
    "contract",
    "agreement",
    "clause",
    "payment",
    "termination",
    "renewal",
    "vendor",
    "client",
    "party",
    "obligation",
]


def summarize_contract(text):

    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()

    summary = summarizer(parser.document, 5)

    return "\n".join(str(sentence) for sentence in summary)


def ask_with_contract(question, context):

    question = question.lower()

    if "summary" in question or "summarize" in question:
        return summarize_contract(context)

    if "payment" in question:
        return "Search payment clause inside the contract."

    if "termination" in question:
        return "Search termination clause inside the contract."

    return summarize_contract(context)


def is_contract_question(question):

    q = question.lower()

    return any(word in q for word in CONTRACT_KEYWORDS)


def general_chat(question):

    return "Hello! Please upload a contract and ask contract-related questions."