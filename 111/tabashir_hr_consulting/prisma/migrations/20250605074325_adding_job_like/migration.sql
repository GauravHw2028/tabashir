-- CreateTable
CREATE TABLE "JobLike" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobLike_userId_idx" ON "JobLike"("userId");

-- AddForeignKey
ALTER TABLE "JobLike" ADD CONSTRAINT "JobLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
