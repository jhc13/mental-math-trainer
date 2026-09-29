-- CreateIndex
CREATE INDEX CONCURRENTLY "Problem_userId_operation_operandLengths_idx" ON "Problem"("userId", "operation", "operandLengths");
