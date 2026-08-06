from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer


def summarize_contract(context):
    """
    Summarize the contract text using the Sumy LSA summarizer.
    """

    if not context or not context.strip():
        return "No contract content available to summarize."

    parser = PlaintextParser.from_string(
        context,
        Tokenizer("english")
    )

    summarizer = LsaSummarizer()

    summary = summarizer(
        parser.document,
        5
    )

    return "\n".join(
        str(sentence)
        for sentence in summary
    )