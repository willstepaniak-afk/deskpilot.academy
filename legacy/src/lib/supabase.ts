import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid
const isValidUrl = supabaseUrl && typeof supabaseUrl === "string" && supabaseUrl.startsWith("http");
const isValidKey = supabaseAnonKey && typeof supabaseAnonKey === "string" && supabaseAnonKey.length > 0;

let supabaseClient: any;

if (isValidUrl && isValidKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "⚠️ [Supabase] Missing or invalid VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n" +
    "Running in mock mode. Please configure these environment variables in Vercel settings for full functionality."
  );

  // Helper to create a proxy that acts like a chainable builder
  const createMockBuilder = () => {
    const builder: any = new Proxy(() => {}, {
      get(target, prop) {
        if (prop === "then") {
          return (resolve: any) => resolve({ data: [], error: null });
        }
        return builder;
      },
      apply(target, thisArg, argumentsList) {
        return builder;
      }
    });
    return builder;
  };

  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Return dummy subscription with unsubscribe
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
      signOut: async () => {},
      signUp: async () => ({ data: { user: null }, error: new Error("Supabase is not configured.") }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error("Supabase is not configured.") }),
    },
    from: (table: string) => {
      console.warn(`[Supabase Mock] Attempted to access table: "${table}" without database configuration.`);
      return createMockBuilder();
    },
  };
}

export const supabase = supabaseClient;

