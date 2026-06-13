-- CreateTable
CREATE TABLE "agent_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "public_address" TEXT NOT NULL,
    "version" TEXT DEFAULT '1.0.0',
    "skills" TEXT[],
    "tags" TEXT[],
    "socials" JSONB,
    "token_id" TEXT,
    "metadata_uri" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "registered_at" TIMESTAMP(3),
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "display_name" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "email" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_profiles_public_address_key" ON "agent_profiles"("public_address");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profiles_token_id_key" ON "agent_profiles"("token_id");

-- CreateIndex
CREATE INDEX "agent_profiles_owner_id_idx" ON "agent_profiles"("owner_id");

-- CreateIndex
CREATE INDEX "agent_profiles_public_address_idx" ON "agent_profiles"("public_address");

-- CreateIndex
CREATE INDEX "agent_profiles_token_id_idx" ON "agent_profiles"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "agent_profiles" ADD CONSTRAINT "agent_profiles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
