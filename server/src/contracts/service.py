from src.contracts.models import ContractCreate

contracts = []


def get_all_contracts():
    return contracts


def create_contract(data: ContractCreate):
    contract = data.dict()
    contracts.append(contract)
    return contract


def get_compliance_dashboard():
    return {
        "stats": [
            {"title": "Total Contracts", "value": 5, "color": "#2563EB", "icon": "📄"},
            {"title": "Compliant", "value": 3, "color": "#22C55E", "icon": "✅"},
            {"title": "Pending Reviews", "value": 2, "color": "#F59E0B", "icon": "⏳"},
            {"title": "Violations", "value": 1, "color": "#EF4444", "icon": "⚠️"},
        ],
        "departments": [
            {"name": "Legal", "value": 98, "color": "#22C55E"},
            {"name": "Procurement", "value": 85, "color": "#F59E0B"},
            {"name": "Finance", "value": 91, "color": "#2563EB"},
            {"name": "HR", "value": 72, "color": "#EF4444"},
        ],
        "riskContracts": [
            {
                "id": "CTR-2026-001",
                "vendor": "Acme Corp",
                "risk": "Medium",
                "status": "Active",
                "reviewDate": "Jul 12, 2026",
            },
            {
                "id": "CTR-2026-002",
                "vendor": "TechFlow Inc",
                "risk": "Medium",
                "status": "Pending",
                "reviewDate": "Jul 10, 2026",
            },
            {
                "id": "CTR-2026-003",
                "vendor": "Global Logistics",
                "risk": "Medium",
                "status": "Active",
                "reviewDate": "Jul 05, 2026",
            },
            {
                "id": "CTR-2026-004",
                "vendor": "CloudSystems",
                "risk": "Medium",
                "status": "Expired",
                "reviewDate": "Jun 28, 2026",
            },
            {
                "id": "CTR-2026-005",
                "vendor": "Marketing Pros",
                "risk": "Medium",
                "status": "Active",
                "reviewDate": "Jun 15, 2026",
            },
        ],
        "activities": [
            "GDPR audit completed",
            "New compliance policy added",
            "HR contract requires review",
            "ISO checklist updated",
        ],
        "reviews": [
            "ABC Pvt Ltd - 20 Jul",
            "Infosys - 28 Jul",
            "Microsoft - 02 Aug",
        ],
    }


def get_ai_recommendations():
    return [
        {
            "icon": "⚠️",
            "message": "Review contracts expiring within 30 days.",
            "color": "yellow",
        },
        {
            "icon": "🛡️",
            "message": "Update compliance clauses for GDPR.",
            "color": "blue",
        },
        {
            
            "icon": "📅",
            "message": "Schedule audit for high-risk vendors.",
            "color": "green",
        },
    ]


def get_activity_chart():
    return {
        "activePoints": [
            {"x": 80, "y": 210, "label": "Jan", "val": 20},
            {"x": 180, "y": 180, "label": "Feb", "val": 35},
            {"x": 280, "y": 160, "label": "Mar", "val": 45},
            {"x": 380, "y": 130, "label": "Apr", "val": 60},
            {"x": 480, "y": 120, "label": "May", "val": 65},
            {"x": 580, "y": 90, "label": "Jun", "val": 80},
        ],
        "newPoints": [
            {"x": 80, "y": 230, "label": "Jan", "val": 10},
            {"x": 180, "y": 210, "label": "Feb", "val": 20},
            {"x": 280, "y": 190, "label": "Mar", "val": 30},
            {"x": 380, "y": 180, "label": "Apr", "val": 35},
            {"x": 480, "y": 150, "label": "May", "val": 50},
            {"x": 580, "y": 130, "label": "Jun", "val": 60},
        ],
    }

def get_recent_activities():
    return [
        {
            "description": "Contract CTR-2026-001 added.",
            "time": "2 hours ago",
            "icon": "📄",
            "color": "blue",
        },
        {
            "description": "Compliance report exported.",
            "time": "4 hours ago",
            "icon": "📊",
            "color": "green",
        },
        {
            "description": "Vendor agreement updated.",
            "time": "Yesterday",
            "icon": "✏️",
            "color": "orange",
        },
        {
            "description": "Renewal reminder sent.",
            "time": "2 days ago",
            "icon": "🔔",
            "color": "red",
        },
    ]


def get_system_health():
    return [
        {"label": "API Server", "status": "Operational", "color": "green"},
        {"label": "AI Engine", "status": "Active", "color": "green"},
        {"label": "Database", "status": "Operational", "color": "green"},
        {"label": "Storage", "status": "73% Used", "color": "green"},
    ]