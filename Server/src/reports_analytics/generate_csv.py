import csv
from datetime import datetime


async def create_csv(report_title: str, report: dict):

    filename = (
        f"{report_title.lower().replace(' ', '_')}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    )

    with open(filename, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)

        # Header
        writer.writerow(["Field", "Value"])

        # Data
        for key, value in report.items():
            field = key.replace("_", " ").title()
            writer.writerow([field, value])

    return filename
