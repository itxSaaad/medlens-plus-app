from __future__ import annotations


class SupabaseAuthProvider:
    def validate_user_token(self, token: str) -> str:
        if not token:
            raise ValueError("Missing auth token")
        return "user-from-supabase-token"
