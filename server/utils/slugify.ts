import type { PrismaClient } from '@prisma/client'

/** Routes that exist in app/pages/ — cannot be used as slugs */
export const RESERVED_SLUGS = new Set([
  'login', 'register', 'configuracoes', 'agendamentos',
  'barbeiros', 'clientes', 'servicos', 'unidades', 'calendario',
  'api', 'admin', 'app', 'public',
])

/**
 * Convert a string to a URL-friendly slug.
 * Removes accents, lowercases, replaces non-alphanumeric with hyphens.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '')        // trim leading/trailing hyphens
    .slice(0, 60)
}

/**
 * Generate a unique slug for a Barbearia, appending -2, -3, etc. on collision.
 */
export async function generateUniqueSlug(prisma: PrismaClient, nome: string): Promise<string> {
  const base = slugify(nome)
  if (!base) throw new Error('Cannot generate slug from empty name')

  let candidate = base
  let suffix = 2

  while (RESERVED_SLUGS.has(candidate) || await prisma.barbearia.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`
    suffix++
  }

  return candidate
}
