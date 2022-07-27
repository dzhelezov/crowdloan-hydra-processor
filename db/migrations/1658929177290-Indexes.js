module.exports = class Indexes1658929177290 {
  name = 'Indexes1658929177290'

  async up(db) {
    await db.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`)
    await db.query(`ALTER TABLE "contribution" ALTER COLUMN "account_id" DROP NOT NULL`)
    await db.query(`CREATE INDEX "IDX_af692de123e6361c462f8596dc" ON "contributor" ("total_contributed") `)
    await db.query(`CREATE INDEX "IDX_fa19f2fba9f193cfef11679759" ON "contribution" ("balance") `)
    await db.query(`CREATE INDEX "IDX_9b1ac330460a85067ef1c69299" ON "contribution" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_61377c288f7b49300c2c871032" ON "contribution" ("extrinsic_hash") `)
    await db.query(`CREATE INDEX "IDX_f93012d67751621ae15b78a049" ON "contribution" ("referral_code") `)
    await db.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b" FOREIGN KEY ("account_id") REFERENCES "contributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "contribution" ALTER COLUMN "account_id" SET NOT NULL`)
    await db.query(`DROP INDEX "public"."IDX_af692de123e6361c462f8596dc"`)
    await db.query(`DROP INDEX "public"."IDX_fa19f2fba9f193cfef11679759"`)
    await db.query(`DROP INDEX "public"."IDX_9b1ac330460a85067ef1c69299"`)
    await db.query(`DROP INDEX "public"."IDX_61377c288f7b49300c2c871032"`)
    await db.query(`DROP INDEX "public"."IDX_f93012d67751621ae15b78a049"`)
    await db.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_1e238c006392e74f87e2db5bf9b"`)
  }
}
