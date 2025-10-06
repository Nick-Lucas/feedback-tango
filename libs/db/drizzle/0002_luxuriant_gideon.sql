ALTER TABLE "features" ALTER COLUMN "nameEmbedding" SET DATA TYPE halfvec(3072);--> statement-breakpoint
ALTER TABLE "features" ALTER COLUMN "nameEmbedding" DROP NOT NULL;