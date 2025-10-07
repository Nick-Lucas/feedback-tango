CREATE TYPE "public"."project_member_role" AS ENUM('editor', 'owner');--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"projectId" uuid NOT NULL,
	"userId" text NOT NULL,
	"role" "project_member_role" DEFAULT 'editor' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
insert into project_members (id, "projectId", "userId", role, "createdAt")
select uuidv7(),
       f.id,
       u.id,
       case when u.id = f."createdBy" then 'owner'::project_member_role else 'editor'::project_member_role end, now()
from "user" u
join projects f on true;
