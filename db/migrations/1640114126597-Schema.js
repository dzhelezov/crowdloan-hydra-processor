const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Schema1640114126597 {
    name = 'Schema1640114126597'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "contributor" ("id" character varying NOT NULL, "total_contributed" numeric, "para_id" integer NOT NULL, "count_contributions" integer, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contribution" ("id" character varying NOT NULL, "balance" numeric, "block_number" numeric NOT NULL, "extrinsic_hash" text NOT NULL, "early_bird" boolean, "prev_contributed" boolean, "referral_code" text, "account_id" character varying NOT NULL, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1e238c006392e74f87e2db5bf9" ON "contribution" ("account_id") `);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e238c006392e74f87e2db5bf9"`);
        await queryRunner.query(`DROP TABLE "contribution"`);
        await queryRunner.query(`DROP TABLE "contributor"`);
    }
}
