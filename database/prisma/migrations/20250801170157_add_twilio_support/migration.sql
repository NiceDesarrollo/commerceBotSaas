-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "isWhatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twilioAccountSid" TEXT,
ADD COLUMN     "twilioAuthToken" TEXT,
ADD COLUMN     "twilioPhoneNumber" TEXT,
ADD COLUMN     "whatsappAccessToken" TEXT,
ADD COLUMN     "whatsappPhoneNumberId" TEXT,
ADD COLUMN     "whatsappProvider" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "whatsappWebhookToken" TEXT;
