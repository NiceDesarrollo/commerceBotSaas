-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiProvider" TEXT NOT NULL DEFAULT 'gemini';
