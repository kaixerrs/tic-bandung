import { createClient } from "@/utils/supabase/server";
import { Inbox } from "lucide-react";
import EventSubmissionTable from "@/components/admin/EventSubmissionTable";

export const metadata = {
  title: 'Pendaftaran Event Masuk | TIC Kota Bandung',
};

export default async function AdminEventSubmissionsPage() {
  const supabase = await createClient();

  const { data: submissions, error } = await supabase
    .from('event_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Submission Fetch Error:", error);
  }

  const data = submissions || [];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <Inbox className="w-8 h-8 text-[#C9971E]" />
            Pendaftaran Event (Inbox)
          </h1>
          <p className="text-gray-500 mt-2">Tinjau dan kelola pendaftaran kalender event (CoE) dari publik atau EO.</p>
        </div>
      </div>

      <EventSubmissionTable initialData={data} />
    </div>
  );
}
