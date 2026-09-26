
import { createClient } from '@/utils/supabase/server';
import { requireAdminAuth } from '@/app/actions/admin';
import FAQClientPage from './FAQClientPage';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  await requireAdminAuth();
  const supabase = await createClient();
  const { data: faqs, error } = await supabase.from('faqs').select('*').order('order_num', { ascending: true }).order('created_at', { ascending: false });
  
  if (error) {
    return <div className="p-8 text-red-600">Error loading FAQs: {error.message}</div>;
  }

  return <FAQClientPage initialFaqs={faqs || []} />;
}
