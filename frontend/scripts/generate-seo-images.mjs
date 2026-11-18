/**
 * Generates the social preview image and app icons from the existing brand
 * assets. Run with: node scripts/generate-seo-images.mjs
 *
 * Outputs:
 *  - public/images/og-image.jpg      1200x630 Open Graph / Twitter card
 *  - public/icons/icon-192.png
 *  - public/icons/icon-512.png
 *  - public/icons/icon-maskable-512.png
 *  - public/apple-touch-icon.png     180x180
 */
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const logoPath = path.join(publicDir, 'images/logo.jpeg')
const heroPath = path.join(publicDir, 'images/imperial.jpeg')

const NAVY = '#00236F'
const GOLD = '#FEA619'

async function generateOgImage() {
  const logo = await readFile(logoPath)
  const logoData = `data:image/jpeg;base64,${logo.toString('base64')}`

  const background = await sharp(heroPath)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.5, saturation: 0.85 })
    .blur(4)
    .toBuffer()

  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${NAVY}" stop-opacity="0.94"/>
          <stop offset="1" stop-color="#00133d" stop-opacity="0.88"/>
        </linearGradient>
        <clipPath id="logoClip">
          <circle cx="600" cy="172" r="78"/>
        </clipPath>
      </defs>

      <rect width="1200" height="630" fill="url(#bg)"/>

      <circle cx="600" cy="172" r="90" fill="none" stroke="${GOLD}" stroke-width="5"/>
      <image x="522" y="94" width="156" height="156"
             href="${logoData}" clip-path="url(#logoClip)"
             preserveAspectRatio="xMidYMid slice"/>

      <text x="600" y="330" text-anchor="middle"
            font-family="DejaVu Sans, Verdana, sans-serif"
            font-size="66" font-weight="bold" fill="#ffffff">
        Imperial Academy
      </text>

      <rect x="520" y="362" width="160" height="4" rx="2" fill="${GOLD}"/>

      <text x="600" y="424" text-anchor="middle"
            font-family="DejaVu Sans, Verdana, sans-serif"
            font-size="29" fill="${GOLD}">
        Building Strong Foundations for the Future
      </text>

      <text x="600" y="530" text-anchor="middle"
            font-family="DejaVu Sans, Verdana, sans-serif"
            font-size="22" fill="#dbe4ff" opacity="0.9">
        New Tafo Akim, Ghana  ·  imperialacademy.edu.gh
      </text>
    </svg>
  `)

  await sharp(background)
    .composite([{ input: overlay }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(publicDir, 'images/og-image.jpg'))
}

async function generateIcons() {
  const iconsDir = path.join(publicDir, 'icons')
  await mkdir(iconsDir, { recursive: true })

  await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'))

  await sharp(logoPath)
    .resize(192, 192, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'))

  // Maskable icon: logo kept inside the 80% safe zone on brand navy.
  const maskableLogo = await sharp(logoPath).resize(350, 350, { fit: 'contain', background: '#ffffff' }).png().toBuffer()
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: NAVY },
  })
    .composite([{ input: maskableLogo, top: 81, left: 81 }])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'))

  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
}

await Promise.all([generateOgImage(), generateIcons()])
console.log('SEO images generated: og-image.jpg, icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png, apple-touch-icon.png')
