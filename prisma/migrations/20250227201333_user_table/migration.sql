-- CreateEnum
CREATE TYPE "CurrencyEnum" AS ENUM ('INR', 'GBP', 'USD', 'JPY', 'EUR', 'ALL', 'AFN', 'AWG', 'AZN', 'BYN', 'BZD', 'BOB', 'BAM', 'BWP', 'BRL', 'KHR', 'CRC', 'HRK', 'CZK', 'DOP', 'GHS', 'GTQ', 'HNL', 'HUF', 'IDR', 'ILS', 'JMD', 'LAK', 'KGS', 'MKD', 'MYR', 'MNT', 'MUR', 'MAD', 'MZN', 'NIO', 'NGN', 'PAB', 'PYG', 'PEN', 'PHP', 'PLN', 'RON', 'RUB', 'RSD', 'SOS', 'ZAR', 'KRW', 'CHF', 'SEK', 'TWD', 'THB', 'TTD', 'TRY', 'UAH', 'UYU', 'VEF', 'VND', 'QAR', 'ZWD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'succeeded', 'refund', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "photo" TEXT,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "verified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
