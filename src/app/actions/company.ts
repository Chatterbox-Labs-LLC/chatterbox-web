'use strict';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createCompany(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const companySize = formData.get('companySize') as string;

  if (!name || !slug) {
    throw new Error('Name and slug are required');
  }

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // For demo purposes, we might want to allow this or redirect to login
    // In a real app, this should be protected
    redirect('/login');
  }

  // 2. Insert workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      name,
      slug,
      plan_type: 'free'
    })
    .select()
    .single();

  if (workspaceError) {
    console.error('Workspace error:', workspaceError);
    throw new Error('Failed to create workspace');
  }

  // 3. Add user as owner in workspace_members
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      profile_id: user.id,
      role: 'owner',
      status: 'active'
    });

  if (memberError) {
    console.error('Member error:', memberError);
    throw new Error('Failed to add owner to workspace');
  }

  // 4. Redirect to dashboard
  redirect(`/company/${workspace.id}/admin/dashboard`);
}
