import vine from '@vinejs/vine'

export const userValidatorLogin = vine.compile(
  vine.object({
    email: vine.string().email(),
    // .exists({
    //   table :'users',
    //   column :'email'
    // }),
    password: vine.string().trim().escape()
    //.minLength(8)
  }),
)
export const signupvalidator = vine.compile(
    vine.object({
        fullName : vine.string(),
        email :vine.string().email().unique(async (db,val)=>{
          const user =await db.from('users').where('email', val).first()
          if(user)return false
          return true
        }),
        password : vine.string()
       .minLength(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/).escape()
    })
)

export const checkid = vine.compile(
  vine.object({
    id : vine.number().positive().exists({
      table : 'users',
      column : 'id'
    })
  })
)
export const checkemail = vine.compile(
  vine.object({
    email : vine.string().email().exists({
      table : 'users',
      column : 'email'
    })
  })
)
export const updateuserValidator = vine.compile(
  vine.object({
    fullName : vine.string().trim().escape().minLength(3).optional(),
    email : vine.string().email().unique(async (db,val)=>{
      const ex = await db.from('users').where('email', val).first()
      if(ex) return false
      return true
    }).optional()
  })
)
