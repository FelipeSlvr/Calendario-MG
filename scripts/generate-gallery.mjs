import fs from 'node:fs'
import path from 'node:path'

/**
 * Converte nome de pasta em { place, date }.
 * Formatos aceitos:
 *  - "Candelaria - 20-12-2025"
 *  - "Candelaria - 20_12_2025"
 *  - "Candelaria - 20.12.2025"
 *  - "Candelaria - 2025-12-20"
 *  - "Candelaria - 20/12/2025" (no Windows o "/" não é permitido no nome; no deploy você pode até ter, mas localmente não)
 */
function parseFolderName(folderName) {
  const raw = folderName.trim()
  const parts = raw.split(' - ')
  const place = parts[0]?.trim() || raw
  const datePart = (parts[1] || '').trim()

  let dateIso
  if (datePart) {
    const normalized = datePart.replace(/[._]/g, '-').replace(/\s+/g, '')

    // YYYY-MM-DD
    const mIso = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (mIso) {
      dateIso = `${mIso[1]}-${mIso[2]}-${mIso[3]}`
    } else {
      // DD-MM-YYYY
      const mBr = normalized.match(/^(\d{2})-(\d{2})-(\d{4})$/)
      if (mBr) {
        dateIso = `${mBr[3]}-${mBr[2]}-${mBr[1]}`
      } else {
        // DD-MM-YY (assume 20YY)
        const mShort = normalized.match(/^(\d{2})-(\d{2})-(\d{2})$/)
        if (mShort) {
          dateIso = `20${mShort[3]}-${mShort[2]}-${mShort[1]}`
        }
      }
    }
  }

  return { place, date: dateIso } // date pode ser undefined
}

function listSubdirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
}

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
}

function isImageFile(name) {
  return /\.(png|jpe?g|webp|gif)$/i.test(name)
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const repoRoot = process.cwd()
const galleryRoot = path.join(repoRoot, 'public', 'galeria')
const outFile = path.join(repoRoot, 'src', 'data', 'gallery.generated.ts')

if (!fs.existsSync(galleryRoot)) {
  console.error('Pasta não encontrada:', galleryRoot)
  process.exit(1)
}

const folders = listSubdirs(galleryRoot)

const entries = folders
  .map((folderName) => {
    const full = path.join(galleryRoot, folderName)
    const files = listFiles(full).filter(isImageFile)

    const { place, date } = parseFolderName(folderName)

    const photos = files.map((fileName) => {
      const title = fileName.replace(/\.[^.]+$/, '')
      const id = `${slugify(folderName)}__${slugify(fileName)}`
      // path público (sem / no começo). A página usa BASE_URL.
      const src = `galeria/${folderName}/${fileName}`
      return { id, title, src }
    })

    return {
      id: slugify(folderName) || folderName,
      folderName,
      place,
      date,
      photos,
    }
  })
  // mais novo primeiro quando tiver data
  .sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return a.folderName.localeCompare(b.folderName)
  })

fs.mkdirSync(path.dirname(outFile), { recursive: true })

const content = `// AUTO-GERADO. NÃO EDITE.
// Gere novamente rodando: npm run gallery:gen

export type GalleryGeneratedPhoto = {
  id: string
  title: string
  src: string
}

export type GalleryGeneratedEntry = {
  id: string
  folderName: string
  place: string
  date?: string
  photos: GalleryGeneratedPhoto[]
}

export const GALLERY_ENTRIES: GalleryGeneratedEntry[] = ${JSON.stringify(entries, null, 2)}
`

fs.writeFileSync(outFile, content, 'utf8')
console.log(`OK: gerado ${path.relative(repoRoot, outFile)} (${entries.length} pastas)`)
