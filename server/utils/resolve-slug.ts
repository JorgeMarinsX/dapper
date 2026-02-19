import prisma from './prisma'

/**
 * Resolve a barbearia slug to its ID. Throws 404 if not found.
 */
export async function resolveSlug(slug: string): Promise<string> {
  const barbearia = await prisma.barbearia.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!barbearia) {
    throw createError({ statusCode: 404, statusMessage: 'Barbearia não encontrada' })
  }

  return barbearia.id
}
