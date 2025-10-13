DROP INDEX "features_name_embedding_idx_cosine";--> statement-breakpoint
DROP INDEX "raw_feedback_safety_check_idx";--> statement-breakpoint
DROP INDEX "raw_feedback_feature_association_idx";--> statement-breakpoint
DROP INDEX "raw_feedback_project_idx";--> statement-breakpoint
CREATE INDEX "features_nameEmbedding_index" ON "features" USING hnsw ("nameEmbedding" halfvec_cosine_ops);--> statement-breakpoint
CREATE INDEX "raw_feedback_safetyCheckComplete_index" ON "raw_feedback" USING btree ("safetyCheckComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_featureAssociationComplete_index" ON "raw_feedback" USING btree ("featureAssociationComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_processingError_index" ON "raw_feedback" USING btree ("processingError");--> statement-breakpoint
CREATE INDEX "raw_feedback_projectId_index" ON "raw_feedback" USING btree ("projectId");