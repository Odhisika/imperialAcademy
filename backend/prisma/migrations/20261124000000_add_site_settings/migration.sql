-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "twitter_url" TEXT,
    "linkedin_url" TEXT,
    "youtube_url" TEXT,
    "tiktok_url" TEXT,
    "address_line1" VARCHAR(255) NOT NULL DEFAULT 'TQ 63, New Tafo Akim',
    "digital_address" VARCHAR(100) NOT NULL DEFAULT 'EE-1049-7190',
    "phone1" VARCHAR(50) NOT NULL DEFAULT '0201188847',
    "phone2" VARCHAR(50),
    "email" VARCHAR(150) NOT NULL DEFAULT 'imperailacademy68@gmail.com',
    "weekday_hours" VARCHAR(100) NOT NULL DEFAULT '8:00 AM - 4:00 PM',
    "saturday_hours" VARCHAR(100) NOT NULL DEFAULT '9:00 AM - 1:00 PM',
    "sunday_hours" VARCHAR(100) NOT NULL DEFAULT 'Closed',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
