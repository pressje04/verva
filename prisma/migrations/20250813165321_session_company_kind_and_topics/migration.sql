-- CreateEnum
CREATE TYPE "MsgRole" AS ENUM ('user', 'ai');

-- CreateEnum
CREATE TYPE "InterviewKind" AS ENUM ('behavioral', 'technical', 'leadership');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "company" TEXT,
ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "interviewId" TEXT,
ADD COLUMN     "interviewKind" "InterviewKind",
ADD COLUMN     "jobRole" TEXT,
ADD COLUMN     "language" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "briefFeedback" TEXT,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "question" TEXT,
ADD COLUMN     "topic" TEXT,
ADD COLUMN     "transcript" TEXT,
ADD COLUMN     "turn" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';

-- CreateIndex
CREATE INDEX "InterviewSession_userId_createdAt_idx" ON "InterviewSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_company_idx" ON "InterviewSession"("company");

-- CreateIndex
CREATE INDEX "InterviewSession_interviewKind_idx" ON "InterviewSession"("interviewKind");

-- CreateIndex
CREATE INDEX "Message_sessionId_timestamp_idx" ON "Message"("sessionId", "timestamp");

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
