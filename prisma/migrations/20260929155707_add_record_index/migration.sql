-- CreateIndex
CREATE INDEX CONCURRENTLY "Record_userId_operation_operandLengths_idx" ON "Record"("userId", "operation", "operandLengths");
