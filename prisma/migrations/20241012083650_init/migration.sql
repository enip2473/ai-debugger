-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Problem" (
    "ProblemID" SERIAL NOT NULL,
    "Source" TEXT NOT NULL,
    "SourceProblemId" TEXT NOT NULL,
    "ProblemName" TEXT NOT NULL,
    "RawStatement" TEXT NOT NULL,
    "ProblemType" TEXT NOT NULL,
    "Variables" TEXT NOT NULL,
    "Limits" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("ProblemID")
);

-- CreateTable
CREATE TABLE "Validator" (
    "ValidatorID" SERIAL NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "CodingLanguage" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Upvote" INTEGER NOT NULL,
    "Downvote" INTEGER NOT NULL,
    "IsGenerated" BOOLEAN NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("ValidatorID")
);

-- CreateTable
CREATE TABLE "Checker" (
    "CheckerID" SERIAL NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "CodingLanguage" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Upvote" INTEGER NOT NULL,
    "Downvote" INTEGER NOT NULL,
    "IsGenerated" BOOLEAN NOT NULL,

    CONSTRAINT "Checker_pkey" PRIMARY KEY ("CheckerID")
);

-- CreateTable
CREATE TABLE "Solution" (
    "SolutionID" SERIAL NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "CodingLanguage" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Upvote" INTEGER NOT NULL,
    "Downvote" INTEGER NOT NULL,
    "IsGenerated" BOOLEAN NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("SolutionID")
);

-- CreateTable
CREATE TABLE "Generator" (
    "GeneratorID" SERIAL NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "CodingLanguage" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Upvote" INTEGER NOT NULL,
    "Downvote" INTEGER NOT NULL,
    "IsGenerated" BOOLEAN NOT NULL,

    CONSTRAINT "Generator_pkey" PRIMARY KEY ("GeneratorID")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "TestCaseID" SERIAL NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "Content" TEXT NOT NULL,
    "IsGenerated" BOOLEAN NOT NULL,
    "Upvote" INTEGER NOT NULL,
    "Downvote" INTEGER NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("TestCaseID")
);

-- CreateTable
CREATE TABLE "Submission" (
    "SubmissionID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "ProblemId" INTEGER NOT NULL,
    "CreatedTime" TIMESTAMP(3) NOT NULL,
    "CodingLanguage" TEXT NOT NULL,
    "Status" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("SubmissionID")
);

-- CreateTable
CREATE TABLE "Revision" (
    "RevisionID" SERIAL NOT NULL,
    "SubmissionID" INTEGER NOT NULL,
    "RevisionNumber" INTEGER NOT NULL,
    "RawCode" TEXT NOT NULL,
    "CreatedTime" TIMESTAMP(3) NOT NULL,
    "CompilerOutput" TEXT NOT NULL,
    "LLMsuggestions" TEXT NOT NULL,
    "CheckerOutput" TEXT NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("RevisionID")
);

-- AddForeignKey
ALTER TABLE "Validator" ADD CONSTRAINT "Validator_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checker" ADD CONSTRAINT "Checker_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generator" ADD CONSTRAINT "Generator_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_ProblemId_fkey" FOREIGN KEY ("ProblemId") REFERENCES "Problem"("ProblemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_SubmissionID_fkey" FOREIGN KEY ("SubmissionID") REFERENCES "Submission"("SubmissionID") ON DELETE RESTRICT ON UPDATE CASCADE;
