"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link"; 

export default function LessonDetail() {
  const params = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const backendBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const courseSlug = params?.slug as string;       
  const lessonSlug = params?.lessonSlug as string; 

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !courseSlug || !lessonSlug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [lessonRes, courseRes] = await Promise.all([
          axios.get(`${backendBaseURL}/api/lessons/${lessonSlug}/`),
          axios.get(`${backendBaseURL}/api/courses/${courseSlug}/`)
        ]);
        setLesson(lessonRes.data);
        setCourse(courseRes.data);
      } catch (err) {
        console.error("❌ API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mounted, courseSlug, lessonSlug]);

  if (!mounted) return null;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-mono text-[10px] tracking-widest text-slate-400">
      RESTORING_WORKSPACE_LAYOUT...
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white font-sans selection:bg-slate-100">
      
      {/* 📁 LEFT SIDEBAR (Solid Navigation) */}
      <aside className="hidden lg:flex flex-col w-[320px] border-r border-slate-200 sticky top-0 h-screen overflow-y-auto bg-white">
        
        {/* Course Header - Bold Black */}
        <div className="p-6">
          <div className="bg-slate-900 p-5 rounded-2xl text-center shadow-md">
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              {course?.title || "Course"}
            </h2>
          </div>
        </div>

        {/* Modules Navigation */}
        <div className="px-6 pb-20 space-y-8">
          {course?.modules?.map((mod: any) => (
            <div key={mod.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              
              {/* Module Title - Solid Strip */}
              <div className="bg-slate-900 py-3.5 px-4 text-center border-b border-slate-800">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
                  {mod.title}
                </h4>
              </div>

              {/* Lesson Titles - Bold List */}
              <div className="divide-y divide-slate-100">
                {mod.lessons?.map((les: any) => (
                  <Link 
                    key={les.id}
                    href={`/courses/${courseSlug}/${les.slug}`}
                    className={`flex items-center justify-center text-center text-[13px] py-4 px-5 transition-all font-bold leading-tight ${
                      les.slug === lessonSlug 
                      ? 'bg-slate-50 text-slate-900 border-l-4 border-slate-900' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{les.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 🟢 FULL-WIDTH MAIN CONTENT AREA */}
      <main className="flex-1 bg-white border-r border-slate-100 min-w-0">
        <div className="w-full px-8 py-10 lg:px-14">
          
          <header className="mb-12 border-b-2 border-slate-50 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                System_Log // {lessonSlug}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-[1.1]">
              {lesson?.title}
            </h1>
          </header>

          <article className="prose prose-slate max-w-none w-full">
            <div 
              className="ck-content text-[18px] text-slate-700 leading-relaxed font-normal w-full"
              dangerouslySetInnerHTML={{ 
                __html: lesson?.content?.replace(/src="\/media\//g, `src="${backendBaseURL}/media/`) || "" 
              }} 
            />
          </article>

          {/* Navigation Buttons */}
          <div className="mt-24 pt-10 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            {lesson?.prev_lesson?.slug ? (
              <Link 
                href={`/courses/${courseSlug}/${lesson.prev_lesson.slug}`}
                className="w-full sm:w-auto px-10 py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all text-center"
              >
                ← Back
              </Link>
            ) : <div />}

            {lesson?.next_lesson?.slug ? (
              <Link 
                href={`/courses/${courseSlug}/${lesson.next_lesson.slug}`}
                className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
              >
                Proceed Next →
              </Link>
            ) : (
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">End_Of_Document</span>
            )}
          </div>
        </div>
      </main>

      {/* 💰 RIGHT SIDEBAR (Ads) */}
      <aside className="hidden xl:flex flex-col w-[280px] sticky top-0 h-screen bg-[#fafafa] p-6 gap-6 overflow-y-auto border-l border-slate-100">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Sponsored</span>
        
        <div className="w-full aspect-square bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-200 uppercase text-center p-4">
          Space_1
        </div>

        <div className="w-full h-[600px] bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-200 uppercase text-center p-4">
          Premium_Banner
        </div>

        <div className="w-full aspect-square bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-200 uppercase text-center p-4">
          Space_3
        </div>
      </aside>

      <style jsx global>{`
        .ck-content { width: 100% !important; }
        .ck-content h2 { font-weight: 900; font-size: 1.8rem; margin-top: 4rem; color: #000; text-transform: uppercase; border-bottom: 2px solid #000; display: inline-block; margin-bottom: 1rem; }
        .ck-content p { margin-top: 1.5rem; line-height: 1.85; color: #334155; width: 100%; }
        .ck-content pre { background: #000; color: #fff; padding: 2rem; border-radius: 12px; margin-top: 2rem; overflow-x: auto; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; border: 1px solid #334155; }
        .ck-content code { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 6px; color: #e11d48; font-weight: 700; }
        .ck-content img { border-radius: 1rem; margin: 3rem 0; max-width: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; }
      `}</style>
    </div>
  );
}