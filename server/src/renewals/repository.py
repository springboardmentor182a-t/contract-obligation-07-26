from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Renewal


class RenewalRepository:

    async def get_all(self, db: AsyncSession):
        result = await db.execute(select(Renewal))
        return result.scalars().all()

    async def create(self, db: AsyncSession, renewal: Renewal):
        db.add(renewal)
        await db.commit()
        await db.refresh(renewal)
        return renewal