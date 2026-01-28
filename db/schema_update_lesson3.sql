-- Lesson 3: 增加 AI 审计相关字段 (2026-01-21)
ALTER TABLE assets 
ADD COLUMN ai_score TEXT,
ADD COLUMN ai_risk_level TEXT,
ADD COLUMN ai_comment TEXT;