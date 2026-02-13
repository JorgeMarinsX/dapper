import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, cnpj, telefone, endereco } = body

  const updated = await prisma.barbearia.update({
    where: { id: barbeariaId },
    data: {
      ...(nome !== undefined && { nome }),
      ...(cnpj !== undefined && { cnpj }),
      ...(telefone !== undefined && { telefone }),
      ...(endereco !== undefined && { endereco }),
    },
    omit: { senha: true },
  })

  return updated
})
