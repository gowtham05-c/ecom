import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "@/lib/validator";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  ratings?: number;
  createdAt: Date;
};

export type SignInResponse = {
  success: boolean;
  message: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
