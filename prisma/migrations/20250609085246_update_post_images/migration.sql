/*
  Warnings:

  - A unique constraint covering the columns `[post_id,id]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "PostImage_post_id_idx" ON "PostImage"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostImage_post_id_id_key" ON "PostImage"("post_id", "id");
