-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'CONTENT_MANAGER', 'SALES');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
