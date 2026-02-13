import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId

  const config = await prisma.configuracaoNotificacao.findUnique({
    where: { barbeariaId },
  })

  if (!config) {
    throw createError({ statusCode: 404, statusMessage: 'Configuração de notificação não encontrada' })
  }

  return config
})
