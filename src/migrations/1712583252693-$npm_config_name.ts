import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712583252693 implements MigrationInterface {
    name = ' $npmConfigName1712583252693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request_log" ("id" SERIAL NOT NULL, "accessKey" character varying NOT NULL, "requestedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_ae393b42f50b0399df4c90160d6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "request_log"`);
    }

}
