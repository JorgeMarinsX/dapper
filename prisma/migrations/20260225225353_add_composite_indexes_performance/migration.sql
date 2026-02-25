-- CreateIndex
CREATE INDEX "Agendamento_barbeiroId_dataHora_idx" ON "Agendamento"("barbeiroId", "dataHora");

-- CreateIndex
CREATE INDEX "Agendamento_barbeariaId_dataHora_idx" ON "Agendamento"("barbeariaId", "dataHora");
