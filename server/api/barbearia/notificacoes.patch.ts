import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { emailConfirmacao, smsLembrete, antecedencia } = body

  return prisma.configuracaoNotificacao.upsert({
    where: { barbeariaId },
    update: {
      ...(emailConfirmacao !== undefined && { emailConfirmacao }),
      ...(smsLembrete !== undefined && { smsLembrete }),
      ...(antecedencia !== undefined && { antecedencia }),
    },
    create: {
      barbeariaId,
      emailConfirmacao: emailConfirmacao ?? true,
      smsLembrete: smsLembrete ?? true,
      antecedencia: antecedencia ?? 2,
    },
  })
})
