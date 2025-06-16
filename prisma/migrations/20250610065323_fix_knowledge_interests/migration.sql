-- AlterTable
ALTER TABLE "User" ADD COLUMN     "knowledge_interests" TEXT[] DEFAULT ARRAY[]::TEXT[];
