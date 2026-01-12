import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-20 border-b border-slate-200 bg-white dark:bg-slate-900 px-8 flex items-center justify-end transition-colors">
      <div className="flex items-center gap-8">
        <div className="flex items-center justify-center w-12 h-12">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full cursor-pointer"
          >
            <Bell size={40} />
            {/* chấm đỏ khi có thông báo*/}
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </Button>
        </div>

        <div className="flex items-center justify-center w-12 h-12 cursor-pointer group">
          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 group-hover:ring-2 group-hover:ring-blue-500/20 transition-all">
            <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>

      </div>
    </header>
  );
}