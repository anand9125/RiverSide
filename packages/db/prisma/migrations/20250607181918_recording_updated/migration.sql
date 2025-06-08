-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('PENDING', 'UPLOADING', 'UPLOADED', 'MERGED', 'ERROR');

-- AlterTable
ALTER TABLE "Recording" ADD COLUMN     "chunkIndex" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "RecordingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "uploadSessionId" TEXT;
