import z from 'zod'

export const ChangeProfileBodySchema = z.object({
  weight: z
    .string()
    .min(2, 'Peso deve ter pelo menos 2 caracteres')
    .optional()
    .describe('Peso do usuário'),
  height: z
    .string()
    .min(2, 'Altura deve ter pelo menos 2 caracteres')
    .optional()
    .describe('Altura do usuário'),
  mainObjective: z
    .enum(['MASS_GAIN', 'STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'CONDITIONING'])
    .describe('Objetivo principal do usuário'),
  about: z.string().nullable().optional().describe('Sobre o usuário'),
})
export const ChangeProfileParamsSchema = z.object({
  id: z.string().describe('ID do usuário'),
})
export const ChangeProfileResponseSchema = z.object({
  userId: z.string().describe('ID do usuário associado ao perfil'),
  weight: z.string().optional().describe('Peso do usuário'),
  height: z.string().optional().describe('Altura do usuário'),
  mainObjective: z
    .enum(['MASS_GAIN', 'STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'CONDITIONING'])
    .optional()
    .describe('Objetivo principal do usuário'),
  about: z.string().nullable().optional().describe('Sobre o usuário'),
})

export type ChangeProfileBody = z.infer<typeof ChangeProfileBodySchema>
export type ChangeProfileParams = z.infer<typeof ChangeProfileParamsSchema>
export type ChangeProfileResponse = z.infer<typeof ChangeProfileResponseSchema>
