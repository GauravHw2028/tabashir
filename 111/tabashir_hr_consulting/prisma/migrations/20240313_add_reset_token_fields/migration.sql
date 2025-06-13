-- Add reset token fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);

-- Create index for resetToken
CREATE INDEX IF NOT EXISTS "users_resetToken_idx" ON "users"("resetToken"); 