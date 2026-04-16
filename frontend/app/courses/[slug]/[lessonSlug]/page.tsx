import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import MobileMenu from "@/src/components/MobileMenu";

async function getLessonData(courseSlug: string, lessonSlug: string) {
  const backendBaseURL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
  try {
    const [lessonRes, courseRes] = await Promise.all([
      axios.get(`${backendBaseURL}/api/lessons/${lessonSlug}/`),
      axios.get(`${backendBaseURL}/api/courses/${courseSlug}/`)
    ]);
    return { lesson: lessonRes.data, course: courseRes.data, backendBaseURL };
  } catch (err: any) { return null; }
}

export default async function LessonDetail(props: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const params = await props.params;
  const { slug, lessonSlug } = params;
  const data = await getLessonData(slug, lessonSlug);

  if (!data) return notFound();
  const { lesson, course, backendBaseURL } = data;

  // --- 📦 1. SIDEBAR: The "God Tier" Engineering Sidebar ---
  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative p-8 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 mb-3">
            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em]">Engineering Path</span>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none italic">{course?.title}</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-10 mt-6">
        {course?.modules?.map((mod: any) => (
          <div key={mod.id} className="relative group">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-100 group-hover:border-indigo-500 transition-colors">
                <span className="text-slate-900 font-black italic text-lg">{mod.id}</span>
              </div>
              <h4 className="text-[20px] font-black text-slate-900 uppercase tracking-tighter leading-none">{mod.title}</h4>
            </div>

            <div className="space-y-2 relative pl-5 border-l-2 border-slate-200 ml-5">
              {mod.lessons?.map((les: any) => {
                const isActive = les.slug === lessonSlug;
                return (
                  <Link 
                    key={les.id}
                    href={`/courses/${slug}/${les.slug}`}
                    className={`relative flex items-center gap-4 py-4 px-5 rounded-2xl transition-all duration-300 group/item ${
                      isActive ? 'bg-white shadow-[0_10px_30px_-5px_rgba(79,70,229,0.2)] border border-indigo-100 scale-[1.02] z-10' : 'hover:bg-white hover:shadow-md border border-transparent'
                    }`}
                  >
                    {isActive && <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50 shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>}
                    <div className={`flex items-center justify-center min-w-[32px] h-8 rounded-xl font-black text-[10px] ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{les.id}</div>
                    <span className={`text-[15px] tracking-tight leading-tight ${isActive ? 'text-indigo-600 font-black' : 'text-slate-500 font-bold group-hover/item:text-slate-900'}`}>{les.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <MobileMenu>{SidebarContent}</MobileMenu>

      <div className="flex flex-1">
        {/* ⬅️ LEFT SIDEBAR (Wide & Fixed) */}
        <aside className="hidden lg:flex flex-col w-[380px] border-r border-slate-200 sticky top-0 h-screen overflow-hidden">{SidebarContent}</aside>

        {/* 🟢 CONTENT & ADS AREA */}
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 flex flex-col min-w-0">
            <div className="px-6 py-12 md:px-14 lg:px-20 w-full">
              
              <header className="mb-16 border-b-8 border-slate-950 pb-10">
                <div className="flex items-center gap-4 mb-4">
                   <div className="h-1.5 w-12 bg-indigo-600"></div>
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Node_Execution // {lessonSlug}</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-[0.9]">{lesson?.title}</h1>
              </header>

              {/* 📖 CONTENT: Balanced Readability */}
              <article className="w-full">
                <div 
                  className="ck-content text-[17px] text-slate-700 leading-[1.8] font-medium tracking-normal" 
                  dangerouslySetInnerHTML={{ __html: lesson?.content?.replace(/src="\/media\//g, `src="${backendBaseURL}/media/`) || "" }} 
                />
              </article>

              {/* 🧭 NAVIGATION: Screen Corners */}
              <div className="mt-32 pt-12 border-t-4 border-slate-100 flex items-center justify-between w-full pb-20">
                <div>
                  {lesson?.prev_lesson?.slug && (
                    <Link href={`/courses/${slug}/${lesson.prev_lesson.slug}`} className="group flex flex-col items-start gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">← Phase_Back</span>
                      <div className="px-8 py-4 bg-white border-2 border-slate-950 text-slate-950 font-black text-base rounded-2xl group-hover:bg-slate-950 group-hover:text-white transition-all shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        {lesson.prev_lesson.title}
                      </div>
                    </Link>
                  )}
                </div>

                <div className="text-right">
                  {lesson?.next_lesson?.slug ? (
                    <Link href={`/courses/${slug}/${lesson.next_lesson.slug}`} className="group flex flex-col items-end gap-3">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">Phase_Next →</span>
                      <div className="px-10 py-4 bg-slate-950 text-white font-black text-base rounded-2xl group-hover:bg-indigo-600 transition-all shadow-[6px_6px_0px_rgba(79,70,229,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        {lesson.next_lesson.title}
                      </div>
                    </Link>
                  ) : (
                    <div className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-[6px_6px_0px_#14532d]">Success ✓</div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* ➡️ RIGHT ADS (The Clean Aside) */}
          <aside className="hidden xl:flex flex-col w-[380px] border-l border-slate-100 sticky top-0 h-screen bg-[#fafafa]">
             <div className="p-10 space-y-10">
                <div className="w-full bg-white border-2 border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-slate-950 rounded-2xl mb-6 flex items-center justify-center text-white text-2xl font-black italic shadow-xl">B</div>
                   <h4 className="text-[11px] font-black text-slate-950 uppercase mb-2">Sponsor_Block</h4>
                   <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">Premium DevOps mentorship and infra-automated scripts.</p>
                </div>
                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                   <h5 className="text-[11px] font-black uppercase mb-3 tracking-widest italic underline underline-offset-4 decoration-indigo-300">Pro Tip</h5>
                   <p className="text-[11px] text-indigo-100 font-bold leading-relaxed italic italic">"Automate everything, but document first."</p>
                </div>
             </div>
          </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ck-content h2 { font-weight: 900; font-size: 2.2rem; margin: 4rem 0 1.5rem; color: #000; text-transform: uppercase; border-left: 10px solid #6366f1; padding-left: 1.5rem; letter-spacing: -0.05em; } 
        .ck-content p { margin-bottom: 2rem; }
        .ck-content pre { background: #000; color: #10B981; padding: 2rem; border-radius: 1.5rem; margin: 2rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; border: 1px solid #1e293b; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }
        .ck-content code:not(pre code) { background: #f1f5f9; color: #4f46e5; padding: 0.2rem 0.5rem; border-radius: 0.4rem; font-weight: 800; border: 1px solid #e2e8f0; }
        .ck-content ul { list-style-type: square; padding-left: 1.5rem; margin-bottom: 2rem; color: #475569; }
      ` }} />
    </div>
  );
}