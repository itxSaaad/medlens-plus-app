import os

import psycopg
import pytest
from redis import Redis


@pytest.mark.integration
def test_postgres_connectivity() -> None:
    database_url = os.getenv("DATABASE_URL", "postgresql://medlens:medlens@localhost:5432/medlens")
    with psycopg.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            result = cur.fetchone()
    assert result is not None
    assert result[0] == 1


@pytest.mark.integration
def test_redis_connectivity() -> None:
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    client = Redis.from_url(redis_url)
    assert client.ping() is True
