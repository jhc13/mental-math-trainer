-- AlterTable
ALTER TABLE "_RecordExcludedProblems" ADD CONSTRAINT "_RecordExcludedProblems_AB_pkey" PRIMARY KEY USING INDEX "_RecordExcludedProblems_AB_unique";

-- AlterTable
ALTER TABLE "_RecordProblems" ADD CONSTRAINT "_RecordProblems_AB_pkey" PRIMARY KEY USING INDEX "_RecordProblems_AB_unique";
