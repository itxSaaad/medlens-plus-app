# Deployment Strategy

## Phase 1 (Free)

- Web: Vercel Free
- API: Render/Fly free service
- DB/Auth: Supabase free tier
- Queue: Upstash free tier
- Storage: R2 free/low-cost tier

## Phase 2 (Scale)

- Web: Vercel Pro or CloudFront + S3
- API/Workers: AWS ECS Fargate or Lambda mix
- DB: RDS Postgres/Aurora
- Queue: SQS + DLQ
- Storage: S3

## IaC

Use Terraform modules under `infra/terraform/` to keep migration predictable.
