-- CreateTable
CREATE TABLE "BrandingSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'branding',
    "logoUrl" TEXT,
    "mobileLogoUrl" TEXT,
    "darkLogoUrl" TEXT,
    "faviconUrl" TEXT,
    "logoWidth" TEXT,
    "logoHeight" TEXT
);

-- CreateTable
CREATE TABLE "HeaderSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'header',
    "backgroundColor" TEXT,
    "backgroundOpacity" REAL DEFAULT 1,
    "blur" REAL DEFAULT 0,
    "borderColor" TEXT,
    "borderWidth" REAL,
    "shadow" TEXT,
    "height" TEXT,
    "navFontSize" TEXT,
    "navFontWeight" TEXT,
    "navSpacing" TEXT,
    "navHoverColor" TEXT,
    "navActiveColor" TEXT,
    "navUnderline" BOOLEAN,
    "navUnderlineThickness" REAL,
    "navUnderlineSpeed" REAL,
    "buttonText" TEXT,
    "buttonBgColor" TEXT,
    "buttonHoverBg" TEXT
);

-- CreateTable
CREATE TABLE "ButtonSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'button',
    "variant" TEXT NOT NULL,
    "bgColor" TEXT,
    "textColor" TEXT,
    "borderColor" TEXT,
    "borderWidth" REAL,
    "borderRadius" REAL,
    "padding" TEXT,
    "fontSize" TEXT,
    "fontWeight" TEXT,
    "hoverBgColor" TEXT,
    "hoverTextColor" TEXT,
    "hoverBorderColor" TEXT,
    "hoverScale" REAL,
    "hoverShadow" TEXT,
    "transitionDuration" REAL
);

-- CreateTable
CREATE TABLE "TextHoverSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'textHover',
    "effectType" TEXT NOT NULL,
    "color" TEXT,
    "opacity" REAL,
    "underline" BOOLEAN,
    "underlineThickness" REAL,
    "underlineOffset" REAL,
    "letterSpacing" REAL,
    "transform" TEXT,
    "scale" REAL,
    "glow" TEXT,
    "shadow" TEXT,
    "transitionDuration" REAL,
    "easing" TEXT
);

-- CreateTable
CREATE TABLE "LinkHoverSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'linkHover',
    "effectType" TEXT NOT NULL,
    "color" TEXT,
    "hoverColor" TEXT,
    "underline" BOOLEAN,
    "underlineThickness" REAL,
    "transitionDuration" REAL,
    "easing" TEXT
);

-- CreateTable
CREATE TABLE "CardHoverSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cardHover',
    "effectType" TEXT NOT NULL,
    "scale" REAL,
    "translateY" REAL,
    "shadow" TEXT,
    "borderColor" TEXT,
    "backgroundChange" TEXT,
    "glow" TEXT,
    "imageZoom" REAL,
    "overlayOpacity" REAL,
    "borderRadius" REAL,
    "transitionDuration" REAL,
    "easing" TEXT
);

-- CreateTable
CREATE TABLE "FooterAppearanceSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'footerAppearance',
    "logoUrl" TEXT,
    "description" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "headingColor" TEXT,
    "linkColor" TEXT,
    "linkHoverColor" TEXT,
    "borderColor" TEXT,
    "borderWidth" REAL,
    "spacing" TEXT,
    "padding" TEXT,
    "columnSpacing" TEXT,
    "copyrightText" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT
);

-- CreateTable
CREATE TABLE "FooterHoverSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'footerHover',
    "effectType" TEXT NOT NULL,
    "hoverColor" TEXT,
    "underline" BOOLEAN,
    "underlineThickness" REAL,
    "transitionDuration" REAL,
    "easing" TEXT
);

-- CreateTable
CREATE TABLE "SocialSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'social',
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "iconSize" REAL,
    "color" TEXT,
    "hoverColor" TEXT,
    "background" TEXT,
    "hoverBackground" TEXT,
    "borderRadius" REAL,
    "hoverScale" REAL,
    "hoverRotation" REAL,
    "hoverShadow" TEXT
);

-- CreateTable
CREATE TABLE "ColorSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'colors',
    "primary" TEXT,
    "secondary" TEXT,
    "accent" TEXT,
    "background" TEXT,
    "surface" TEXT,
    "heading" TEXT,
    "body" TEXT,
    "muted" TEXT,
    "border" TEXT,
    "button" TEXT,
    "buttonHover" TEXT,
    "link" TEXT,
    "linkHover" TEXT,
    "footerBackground" TEXT,
    "footerText" TEXT,
    "footerHeading" TEXT,
    "footerLink" TEXT,
    "footerLinkHover" TEXT
);

-- CreateTable
CREATE TABLE "TypographySettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'typography',
    "primaryFont" TEXT,
    "headingFont" TEXT,
    "bodyFont" TEXT,
    "headingWeight" TEXT,
    "bodyWeight" TEXT,
    "baseSize" REAL,
    "h1Size" REAL,
    "h2Size" REAL,
    "h3Size" REAL,
    "paragraphSize" REAL,
    "lineHeight" REAL,
    "letterSpacing" REAL
);

-- CreateTable
CREATE TABLE "AnimationSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'animation',
    "enableHover" BOOLEAN NOT NULL DEFAULT true,
    "hoverSpeed" REAL,
    "intensity" REAL,
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false
);
