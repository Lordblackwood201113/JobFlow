// Supabase Configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,

  // Storage bucket name
  storageBucket: 'job-documents',

  // OAuth providers configuration
  oauthProviders: {
    google: {
      enabled: true,
      redirectTo: `${window.location.origin}/auth/callback`,
    },
    github: {
      enabled: true,
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  },

  // File upload configuration
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
};

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey);
};
