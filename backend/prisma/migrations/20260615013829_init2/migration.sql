/*
  Warnings:

  - You are about to drop the column `description` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `metadata_uri` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `registered_at` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `agent_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `agent_profiles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "agent_profiles" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "is_active",
DROP COLUMN "metadata_uri",
DROP COLUMN "registered_at",
DROP COLUMN "skills",
DROP COLUMN "socials",
DROP COLUMN "tags",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
