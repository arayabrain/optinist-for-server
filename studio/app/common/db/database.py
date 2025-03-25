from contextlib import contextmanager

from sqlalchemy.orm import sessionmaker
from sqlmodel import create_engine

from .config import DATABASE_CONFIG


@contextmanager
def session_scope():
    engine = create_engine(
        DATABASE_CONFIG.DATABASE_URL,
        pool_recycle=360,
        pool_size=DATABASE_CONFIG.POOL_SIZE,
    )
    SessionLocal = sessionmaker(
        autocommit=False, autoflush=False, expire_on_commit=False, bind=engine
    )
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:  # noqa
        session.rollback()
        raise
    finally:
        session.close()


def get_db():
    try:
        engine = create_engine(
            DATABASE_CONFIG.DATABASE_URL,
            pool_recycle=360,
            pool_size=DATABASE_CONFIG.POOL_SIZE,
        )
        db = sessionmaker(
            autocommit=False, autoflush=False, expire_on_commit=False, bind=engine
        )
        yield db
    finally:
        db.close()
