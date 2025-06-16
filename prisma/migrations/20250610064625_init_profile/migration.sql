-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cover_photo" TEXT,
ALTER COLUMN "last_active" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Call_caller_id_receiver_id_idx" ON "Call"("caller_id", "receiver_id");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Comment_user_id_post_id_idx" ON "Comment"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "Connection_user1_id_user2_id_idx" ON "Connection"("user1_id", "user2_id");

-- CreateIndex
CREATE INDEX "Like_user_id_post_id_idx" ON "Like"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "Message_sender_id_receiver_id_idx" ON "Message"("sender_id", "receiver_id");

-- CreateIndex
CREATE INDEX "Otp_user_id_idx" ON "Otp"("user_id");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserCategory_user_id_category_id_idx" ON "UserCategory"("user_id", "category_id");
