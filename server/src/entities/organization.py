from datetime import datetime

class Organization:
    """Pure domain entity for an Organization."""

    def __init__(
        self,
        organization_id: int,
        organization_type: str,
        registration_number: str,
        gst_number: str,
        contact_number: str,
        offical_email: str,
        country: str,
        state: str,
        city: str,
        company_name: str = None,
        join_date: datetime = None,
        is_active: bool = True,
    ):
        self.organization_id = organization_id
        self.organization_type = organization_type
        self.company_name = company_name
        self.registration_number = registration_number
        self.gst_number = gst_number
        self.contact_number = contact_number
        self.offical_email = offical_email
        self.country = country
        self.state = state
        self.city = city
        self.join_date = join_date
        self.is_active = is_active
