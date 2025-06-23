-- This is an empty migration.

-- Mark existing users as verified to prevent disruption of service
UPDATE "users" SET "emailVerified" = NOW() WHERE "emailVerified" IS NULL;