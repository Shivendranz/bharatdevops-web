"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Sidebar({ course }: { course: any }) {
  const { id, lessonId } = useParams(); // URL se IDs nikalne ke liye

  return (
    <aside className="w-[300px] border-r border-slate-100 bg-[#f8fafc] h-full overflow-y-auto no-scrollbar hidden md:block">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-sm font-black uppercase tracking-tight text-slate-800">{course?.title}</h2>
      </div>

      <div className="flex-1">
        {course?.modules?.map((module: any) => (
          <div key={module.id}>
            <div className="px-6 py-3 bg-slate-100/50 text-[10px] font-black text-slate-500 uppercase tracking-tighter border-y border-slate-100">
              {module.title}
            </div>
            <div className="py-2">
              {module.lessons?.map((lesson: any) => (
                <Link 
                  key={lesson.id} 
                  href={`/courses/${id}/${lesson.id}`} 
                  className={`flex items-center px-8 py-3 text-[13px] font-bold transition-all border-l-4 ${
                    lessonId === lesson.id.toString() 
                    ? "bg-white text-orange-600 border-orange-500" 
                    : "text-slate-500 border-transparent hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <span className="mr-3 text-[10px]">●</span>
                  {lesson.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}