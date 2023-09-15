-- CreateTable
CREATE TABLE "GroceryList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "checked" BOOLEAN DEFAULT false,

    CONSTRAINT "GroceryList_pkey" PRIMARY KEY ("id")
);
