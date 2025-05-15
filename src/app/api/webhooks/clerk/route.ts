import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/lib/supabase';

export async function POST(req: Request) {
  // Get the headers directly from the request
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  // If there are no svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Handle the event
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    
    // Get the user's primary email
    const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id);
    
    if (id && primaryEmail) {
      // Create user in Supabase
      await createUser(id, primaryEmail.email_address);
      
      return new Response('User synced to Supabase', { status: 200 });
    }
  }

  return new Response('Webhook received', { status: 200 });
} 