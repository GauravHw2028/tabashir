-- DropIndex
DROP INDEX "users_resetToken_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
