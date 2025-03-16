import * as z from "zod";


export const signupSchema = z.object({
    // Username validation
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[^\s]+$/, "Username cannot contain spaces")
        .regex(/^[a-zA-Z]+$/, "Username cannot contain digits or special characters"),
    
    // Email validation
    email: z
        .string()
        .email("Invalid email address"),
    
    // Password validation
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .regex(/^[^\s]+$/, "Password cannot contain spaces"),
    
    // Confirm Password validation
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .regex(/^[^\s]+$/, "Password cannot contain spaces"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    // Username validation
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[^\s]+$/, "Username cannot contain spaces"),
    
    // Password validation
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[^\s]+$/, "Password cannot contain spaces"),
});


export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
