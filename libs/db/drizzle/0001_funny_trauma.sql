CREATE EXTENSION vector;--> statement-breakpoint

ALTER TABLE "features" ADD COLUMN "nameEmbedding" halfvec(3072);--> statement-breakpoint
CREATE INDEX "features_name_embedding_idx_cosine" ON "features" USING hnsw ("nameEmbedding" halfvec_cosine_ops);
