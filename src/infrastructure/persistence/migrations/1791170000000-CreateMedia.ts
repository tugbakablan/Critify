import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedia1791170000000 implements MigrationInterface {
  name = 'CreateMedia1791170000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_id" uuid NOT NULL, "object_key" character varying(255) NOT NULL, "mime_type" character varying(50) NOT NULL, "size_bytes" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_media" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_media_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "posts" ADD "media_id" uuid`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_posts_media_id" ON "posts" ("media_id") `);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_posts_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_media"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_posts_media_id"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "media_id"`);
    await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_media_owner"`);
    await queryRunner.query(`DROP TABLE "media"`);
  }
}
