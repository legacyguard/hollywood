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
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the request body
    const { action, table, data, filters } = await req.json()

    switch (action) {
      case 'get_legacy_items':
        // Get legacy items for a user
        const { data: items, error: itemsError } = await supabaseClient
          .from('legacy_items')
          .select('*')
          .eq('user_id', data.user_id)
          .order('created_at', { ascending: false })

        if (itemsError) {
          return new Response(
            JSON.stringify({ error: 'Failed to fetch legacy items' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ items }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      case 'create_legacy_item':
        // Create a new legacy item
        const { data: newItem, error: createError } = await supabaseClient
          .from('legacy_items')
          .insert(data)
          .select()
          .single()

        if (createError) {
          return new Response(
            JSON.stringify({ error: 'Failed to create legacy item' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ item: newItem }),
          { 
            status: 201, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      case 'update_legacy_item':
        // Update an existing legacy item
        const { data: updatedItem, error: updateError } = await supabaseClient
          .from('legacy_items')
          .update(data)
          .eq('id', data.id)
          .select()
          .single()

        if (updateError) {
          return new Response(
            JSON.stringify({ error: 'Failed to update legacy item' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ item: updatedItem }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      case 'delete_legacy_item':
        // Delete a legacy item
        const { error: deleteError } = await supabaseClient
          .from('legacy_items')
          .delete()
          .eq('id', data.id)

        if (deleteError) {
          return new Response(
            JSON.stringify({ error: 'Failed to delete legacy item' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ message: 'Item deleted successfully' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      case 'get_user_progress':
        // Get user progress statistics
        const { data: progress, error: progressError } = await supabaseClient
          .from('legacy_items')
          .select('status, created_at')
          .eq('user_id', data.user_id)

        if (progressError) {
          return new Response(
            JSON.stringify({ error: 'Failed to fetch progress' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Calculate progress statistics
        const totalItems = progress.length
        const completedItems = progress.filter(item => item.status === 'completed').length
        const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

        return new Response(
          JSON.stringify({ 
            totalItems, 
            completedItems, 
            progressPercentage,
            recentActivity: progress.slice(0, 5)
          }),
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
