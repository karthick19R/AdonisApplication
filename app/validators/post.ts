import vine from '@vinejs/vine'
export const createPostValidator = vine.compile(
  vine.object({
   receiverid : vine.number().positive().exists({
    table : 'users',
    column : 'id'
   }),
   senderid : vine.number().positive().exists({
    table : 'users',
    column : 'id'
   }),
    content : vine.string().trim().escape()
  })
)

export const postFilterValidator = vine.compile(
  vine.object({
    id : vine.number().optional(),
    date : vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()//try date
  }
  )
)
export const checkid = vine.compile(
  vine.object({
    id : vine.number().positive().exists({
      table : 'posts',
      column : 'id'
    })
  })
)
export const postDeleteValidator = vine.compile(
  vine.object({
    id: vine.number()
      .positive()
      .exists({
        table: 'posts',
        column: 'id'
      })
  })
    
)
export const postupdatevalidator = vine.compile(
  vine.object({
    content : vine.string().escape().minLength(1)
  }

  )
)

