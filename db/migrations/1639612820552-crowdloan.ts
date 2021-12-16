import {MigrationInterface, QueryRunner} from "typeorm";

export class crowdloan1639612820552 implements MigrationInterface {
    name = 'crowdloan1639612820552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contributor" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "total_contributed" numeric, "para_id" integer NOT NULL, "count_contributions" integer, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contribution" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "account_id" character varying NOT NULL, "balance" numeric, "block_number" numeric NOT NULL, "extrinsic_hash" character varying NOT NULL, "early_bird" boolean, "prev_contributed" boolean, "referral_code" character varying, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`);
        await queryRunner.query(`DROP TABLE "contribution"`);
        await queryRunner.query(`DROP TABLE "contributor"`);
    }

}
