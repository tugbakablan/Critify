import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsAndSaves1791180000000 implements MigrationInterface {
  name = 'CreatePaymentsAndSaves1791180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(30) NOT NULL, "name" character varying(100) NOT NULL, "price_cents" integer NOT NULL, "currency" character varying(3) NOT NULL, "save_quota" integer, "duration_days" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_plans" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_plans_code" ON "plans" ("code") `);

    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "plan_id" uuid NOT NULL, "amount_cents" integer NOT NULL, "currency" character varying(3) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_payments" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "entitlements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "plan_id" uuid NOT NULL, "payment_id" uuid NOT NULL, "quota" integer, "used" integer NOT NULL DEFAULT '0', "valid_until" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_entitlements_used_within_quota" CHECK ("quota" IS NULL OR "used" <= "quota"), CONSTRAINT "PK_entitlements" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_entitlements_payment_id" ON "entitlements" ("payment_id") `,
    );

    await queryRunner.query(
      `CREATE TABLE "saved_posts" ("user_id" uuid NOT NULL, "post_id" uuid NOT NULL, "entitlement_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_saved_posts" PRIMARY KEY ("user_id", "post_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_saved_posts_user_id_created_at" ON "saved_posts" ("user_id", "created_at") `,
    );

    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_plan" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_entitlements_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_entitlements_plan" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_entitlements_payment" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_saved_posts_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_saved_posts_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_saved_posts_entitlement" FOREIGN KEY ("entitlement_id") REFERENCES "entitlements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `INSERT INTO "plans" ("code", "name", "price_cents", "currency", "save_quota", "duration_days") VALUES ('SAVE_PACK_20', '20 Kayıt Paketi', 1000, 'EUR', 20, NULL), ('PRO_30', 'Pro · 30 gün sınırsız kayıt', 1500, 'EUR', NULL, 30)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_saved_posts_entitlement"`);
    await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_saved_posts_post"`);
    await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_saved_posts_user"`);
    await queryRunner.query(`ALTER TABLE "entitlements" DROP CONSTRAINT "FK_entitlements_payment"`);
    await queryRunner.query(`ALTER TABLE "entitlements" DROP CONSTRAINT "FK_entitlements_plan"`);
    await queryRunner.query(`ALTER TABLE "entitlements" DROP CONSTRAINT "FK_entitlements_user"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_plan"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_saved_posts_user_id_created_at"`);
    await queryRunner.query(`DROP TABLE "saved_posts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_entitlements_payment_id"`);
    await queryRunner.query(`DROP TABLE "entitlements"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plans_code"`);
    await queryRunner.query(`DROP TABLE "plans"`);
  }
}
