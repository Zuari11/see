import { createClient } from '@supabase/supabase-js';

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get Supabase URL and key from environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for our users table
export type User = {
  id: string; // UUID primary key
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
};

// Create a new user in Supabase
export const createUser = async (clerkId: string, email: string, firstName?: string, lastName?: string, imageUrl?: string) => {
  try {
    // In development without actual Supabase credentials, just log and return mock data
    if (!isProduction && (supabaseUrl === 'https://example.supabase.co' || supabaseAnonKey === 'example-anon-key')) {
      console.log("Development mode - would create/update user:", { 
        clerkId, email, firstName, lastName, imageUrl 
      });
      return {
        id: 'mock-id',
        clerk_id: clerkId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      } as User;
    }
    
    console.log("Creating/updating user in Supabase with:", { 
      clerkId, email, firstName, lastName, imageUrl
    });
    
    const userData = {
      clerk_id: clerkId,
      email,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };
    
    console.log("User data for upsert:", userData);
    
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], 
      { 
        onConflict: 'clerk_id',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return null;
    }

    console.log('Supabase user upsert successful:', data);
    return data[0] as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}; 