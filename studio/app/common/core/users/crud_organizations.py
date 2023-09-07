from sqlmodel import Session

from studio.app.common.models.user import Organization as OrganizationModel
from studio.app.common.schemas.users import Organization


def get_organization(db: Session, organization_id: int):
    organization = (
        db.query(OrganizationModel)
        .filter(OrganizationModel.id == organization_id)
        .first()
    )
    assert organization is not None, "Organization not found"
    return Organization.from_orm(organization)
