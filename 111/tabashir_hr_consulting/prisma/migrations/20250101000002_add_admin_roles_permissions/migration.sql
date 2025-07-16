-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'REGULAR_ADMIN');

-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('MANAGE_USERS', 'MANAGE_JOBS', 'MANAGE_APPLICATIONS', 'MANAGE_PAYMENTS', 'MANAGE_DASHBOARD', 'MANAGE_INTERVIEWS', 'MANAGE_AI_CV', 'MANAGE_HELP', 'MANAGE_ACCOUNT', 'MANAGE_ADMIN_PERMISSIONS');

-- AlterEnum
ALTER TYPE "UserType" RENAME VALUE 'RECURITER' TO 'RECRUITER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN "adminRole" "AdminRole";

-- CreateTable
CREATE TABLE "AdminPermissionAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "AdminPermission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPermissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminPermissionAssignment_userId_idx" ON "AdminPermissionAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermissionAssignment_userId_permission_key" ON "AdminPermissionAssignment"("userId", "permission");

-- AddForeignKey
ALTER TABLE "AdminPermissionAssignment" ADD CONSTRAINT "AdminPermissionAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 