
import * as z from "zod";

// Form schema validation
export const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(50),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(50),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  }, "You must be at least 18 years old"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  civil_status: z.string({
    required_error: "Civil status is required",
  }),
  religion: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  height: z.string().optional(),
  weight: z.string().optional(),
  education: z.string().optional(),
  job: z.string().optional(),
  exercise: z.string().optional(),
  drinking: z.string().optional(),
  smoking: z.string().optional(),
  wants_kids: z.string().optional(),
  has_kids: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
