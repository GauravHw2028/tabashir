-- Add fields for Easy Apply functionality
ALTER TABLE "JobApplication" ADD COLUMN "userId" TEXT;
ALTER TABLE "JobApplication" ADD COLUMN "applicationType" TEXT NOT NULL DEFAULT 'regular';
ALTER TABLE "JobApplication" ADD COLUMN "isDismissed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "JobApplication" ADD COLUMN "resumeId" TEXT;
ALTER TABLE "JobApplication" ADD COLUMN "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "JobApplication" ADD COLUMN "externalJobId" TEXT;

-- Add foreign key constraints
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes for better performance
CREATE INDEX "JobApplication_userId_idx" ON "JobApplication"("userId");
CREATE INDEX "JobApplication_applicationType_idx" ON "JobApplication"("applicationType");
CREATE INDEX "JobApplication_isDismissed_idx" ON "JobApplication"("isDismissed"); 