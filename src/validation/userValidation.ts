import * as z from "zod";



export const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      { message: "Password must include uppercase, lowercase, number, and special character" }),
    confirmPassword: z.string(),
    
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const loginSchema = z.object({
    
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[^\s]+$/, "Username cannot contain spaces"),
    
    
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[^\s]+$/, "Password cannot contain spaces"),
});


export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
