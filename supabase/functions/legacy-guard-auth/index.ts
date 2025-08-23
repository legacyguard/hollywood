import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    )

    // Get the user from the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the request body
    const body = await req.json()
    
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { action, data } = body
    
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    switch (action) {
      case 'get_user_profile':
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
      case 'update_user_profile':
        // Validate update data
        if (!data || typeof data !== 'object') {
          return new Response(
            JSON.stringify({ error: 'Invalid update data' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
         // Update user profile
         const { data: updateData, error: updateError } = await supabaseClient
           .from('profiles')
           .update(data)
           .eq('id', user.id)
           .select()
           .single()

         if (updateError) {
           return new Response(
             JSON.stringify({ error: 'Failed to update profile' }),
             { 
               status: 500, 
               headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
             }
           )
         }

         return new Response(
           JSON.stringify({ profile: updateData }),
           { 
             status: 200, 
             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
           }
         )
            JSON.stringify({ error: 'Invalid update data' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        // Prevent updating sensitive fields
        const { id, created_at, updated_at, ...safeUpdateData } = data
        
        // Update user profile
        const { data: updateData, error: updateError } = await supabaseClient
          .from('profiles')
          .update(safeUpdateData)
          .eq('id', user.id)
          .select()
          .single()

        if (updateError) {
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ profile: updateData }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
