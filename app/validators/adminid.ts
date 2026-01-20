import vine from '@vinejs/vine'

export const adminIdValidator = vine.compile(
  vine.object({
    id: vine.string().uuid({ version: [4] }),
  })
)

