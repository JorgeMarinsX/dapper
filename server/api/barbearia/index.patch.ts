import prisma from '../../utils/prisma'
import { RESERVED_SLUGS } from '../../utils/slugify'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, cnpj, telefone, endereco, slug } = body

  // Validate slug format if provided
  if (slug !== undefined) {
    if (!/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/.test(slug)) {
      throw createError({ statusCode: 400, statusMessage: 'Slug inválido. Use apenas letras minúsculas, números e hífens (3-60 caracteres)' })
    }
    if (RESERVED_SLUGS.has(slug)) {
      throw createError({ statusCode: 400, statusMessage: 'Este nome é reservado e não pode ser usado como slug' })
    }
    const existing = await prisma.barbearia.findUnique({ where: { slug }, select: { id: true } })
    if (existing && existing.id !== barbeariaId) {
      throw createError({ statusCode: 409, statusMessage: 'Este slug já está em uso' })
    }
  }

  const updated = await prisma.barbearia.update({
    where: { id: barbeariaId },
    data: {
      ...(nome !== undefined && { nome }),
      ...(slug !== undefined && { slug }),
      ...(cnpj !== undefined && { cnpj }),
      ...(telefone !== undefined && { telefone }),
      ...(endereco !== undefined && { endereco }),
    },
    omit: { senha: true },
  })

  return updated
})
