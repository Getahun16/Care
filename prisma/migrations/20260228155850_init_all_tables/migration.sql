-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('JOURNAL', 'POLICY_BRIEF', 'MANUAL', 'CONFERENCE', 'REPORT');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NewsEventType" AS ENUM ('NEWS', 'EVENT');

-- CreateEnum
CREATE TYPE "NewsEventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'PUBLISHED', 'PAST');

-- CreateEnum
CREATE TYPE "ResearchPillar" AS ENUM ('SOIL_HEALTH', 'WASTE_VALORIZATION', 'SOCIO_ECONOMIC');

-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "PublicationType" NOT NULL,
    "pillar" "ResearchPillar",
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "abstract" TEXT,
    "url" TEXT,
    "doi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pillar" "ResearchPillar",
    "bio" TEXT,
    "email" TEXT,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "NewsEventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "NewsEventStatus" NOT NULL DEFAULT 'DRAFT',
    "excerpt" TEXT,
    "content" TEXT,
    "location" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pillar" "ResearchPillar" NOT NULL,
    "status" "ResearchStatus" NOT NULL DEFAULT 'ACTIVE',
    "lead" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpactMetric" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "pillar" "ResearchPillar",
    "year" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpactMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
