import z from "zod"

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string()
})

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const CreateRoomSchema = z.object({
  title: z.string().min(3),
  scheduledFor: z.string().datetime()
})