from datetime import datetime
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


async def create_pdf(report_title: str, report: dict):

    filename = (
        f"{report_title.lower().replace(' ', '_')}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

    pdf = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()
    story = []
    story.append(Paragraph(report_title, styles["Heading1"]))
    story.append(Spacer(1, 20))

    data = [["Field", "Value"]]
    for key, value in report.items():
        field = key.replace("_", " ").title()
        data.append([field, str(value)])
    table = Table(data, colWidths=[220, 220])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
                ("TOPPADDING", (0, 1), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
            ]
        )
    )

    story.append(table)
    pdf.build(story)
    return filename
