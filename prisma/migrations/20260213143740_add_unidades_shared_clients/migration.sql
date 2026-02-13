/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Barbearia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barbeariaId,telefone]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barbeariaId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadeId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Barbearia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Barbearia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barbeariaId` to the `Barbeiro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadeId` to the `Barbeiro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barbeariaId` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barbeariaId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cliente_telefone_key";

-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "barbeariaId" TEXT NOT NULL,
ADD COLUMN     "unidadeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Barbearia" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Barbeiro" ADD COLUMN     "barbeariaId" TEXT NOT NULL,
ADD COLUMN     "unidadeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "barbeariaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "barbeariaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Unidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "barbeariaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioFuncionamento" (
    "id" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "aberto" BOOLEAN NOT NULL DEFAULT true,
    "inicio" TEXT NOT NULL DEFAULT '09:00',
    "fim" TEXT NOT NULL DEFAULT '19:00',
    "unidadeId" TEXT NOT NULL,

    CONSTRAINT "HorarioFuncionamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracaoNotificacao" (
    "id" TEXT NOT NULL,
    "emailConfirmacao" BOOLEAN NOT NULL DEFAULT true,
    "smsLembrete" BOOLEAN NOT NULL DEFAULT true,
    "antecedencia" INTEGER NOT NULL DEFAULT 2,
    "barbeariaId" TEXT NOT NULL,

    CONSTRAINT "ConfiguracaoNotificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Unidade_barbeariaId_idx" ON "Unidade"("barbeariaId");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioFuncionamento_unidadeId_diaSemana_key" ON "HorarioFuncionamento"("unidadeId", "diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracaoNotificacao_barbeariaId_key" ON "ConfiguracaoNotificacao"("barbeariaId");

-- CreateIndex
CREATE INDEX "Agendamento_barbeariaId_idx" ON "Agendamento"("barbeariaId");

-- CreateIndex
CREATE INDEX "Agendamento_unidadeId_idx" ON "Agendamento"("unidadeId");

-- CreateIndex
CREATE INDEX "Agendamento_clienteId_idx" ON "Agendamento"("clienteId");

-- CreateIndex
CREATE INDEX "Agendamento_barbeiroId_idx" ON "Agendamento"("barbeiroId");

-- CreateIndex
CREATE INDEX "Agendamento_dataHora_idx" ON "Agendamento"("dataHora");

-- CreateIndex
CREATE UNIQUE INDEX "Barbearia_email_key" ON "Barbearia"("email");

-- CreateIndex
CREATE INDEX "Barbeiro_barbeariaId_idx" ON "Barbeiro"("barbeariaId");

-- CreateIndex
CREATE INDEX "Barbeiro_unidadeId_idx" ON "Barbeiro"("unidadeId");

-- CreateIndex
CREATE INDEX "Cliente_barbeariaId_idx" ON "Cliente"("barbeariaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_barbeariaId_telefone_key" ON "Cliente"("barbeariaId", "telefone");

-- CreateIndex
CREATE INDEX "Servico_barbeariaId_idx" ON "Servico"("barbeariaId");

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barbeiro" ADD CONSTRAINT "Barbeiro_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barbeiro" ADD CONSTRAINT "Barbeiro_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_barbeiroId_fkey" FOREIGN KEY ("barbeiroId") REFERENCES "Barbeiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioFuncionamento" ADD CONSTRAINT "HorarioFuncionamento_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracaoNotificacao" ADD CONSTRAINT "ConfiguracaoNotificacao_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
