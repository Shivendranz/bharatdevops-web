"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import 'ckeditor5/ckeditor5.css';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params?.id;
  const lessonId = params?.lessonId; // ✅ Next.js ab URL se slug (e.g., 'start') nikalega
  
  const pathname = usePathname();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/courses/${id}/`)
        .then((res) => setCourse(res.data))
        .catch((err) => console.error("Sidebar Error:", err));
    }
  }, [id]);

  const isSyllabusPage = pathname === `/courses/${id}` || pathname === `/courses/${id}/`;
  if (isSyllabusPage) return <>{children}</>;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* 📁 SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[380px] shrink-0 border-r border-slate-200">
        
        {/* Course Header */}
        <div className="p-8 bg-white border-b border-slate-200">
           <Link href={`/courses/${id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 hover:text-slate-900 transition-all">
             ← Back to Syllabus
           </Link>
           <h2 className="mt-4 text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight italic">
             {course?.title}
           </h2>
        </div>

        {/* Lessons List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {course?.modules?.map((module: any, mIdx: number) => (
            
            <div key={module.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              
              <div className="px-5 py-5 bg-slate-900 flex items-start gap-3">
                <span className="text-orange-500 font-black text-xs mt-0.5">{mIdx + 1}.</span>
                <h3 className="text-[13px] font-black text-white uppercase tracking-widest leading-relaxed">
                  {module.title}
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {module.lessons?.map((lesson: any, lIdx: number) => (
                  <Link 
                    key={lesson.id} 
                    // ✅ FIXED: Ab ye lesson.slug use karega (No more /10/)
                    href={`/courses/${id}/${lesson.slug}`} 
                    className="group block"
                  >
                    <div className={`
                      flex items-center px-5 py-5 transition-all
                      /* ✅ FIXED: Active highlight ab slug se match hoga */
                      ${lessonId === lesson.slug 
                        ? "bg-orange-50/50" 
                        : "hover:bg-slate-50"
                      }
                    `}>
                      
                      <span className={`text-[12px] font-black mr-4 w-6 shrink-0 ${
                        lessonId === lesson.slug ? "text-orange-500" : "text-slate-300"
                      }`}>
                        {String(lIdx + 1).padStart(2, '0')}
                      </span>

                      <span className={`text-[17px] font-bold tracking-tight leading-snug flex-1 ${
                        lessonId === lesson.slug ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                      }`}>
                        {lesson.title}
                      </span>

                      {lessonId === lesson.slug && (
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}