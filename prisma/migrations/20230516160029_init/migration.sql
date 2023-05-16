-- CreateTable
CREATE TABLE "sites" (
    "id" STRING NOT NULL,
    "longUrl" STRING NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);
