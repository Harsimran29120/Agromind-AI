"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import ChatSection from "./chat"

export default function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative min-h-screen">

      <button
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-2 py-4 rounded-r-md transform -translate-x-1 hover:translate-x-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 z-50"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-sm font-bold vertical-text">Open Chat</span>
      </button>

      <div className="flex bg-slate-800 rounded-xl m-2 flex-col justify-start border w-[22%] p-3">
        <h1 className="flex justify-start text-lg ml-4">Input a location</h1>
       <div className="flex m-3 flex-row">
          <input type="text" />
          <Button className="ml-1">Cerca</Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center items-center">
        Here will be added charts
        <img className="mt-8 w-[30%] rounded-xl" src="https://uicdn.toast.com/toastui/img/tui-chart_mobile.png" alt="" />
      </div>

      {/* Drawer */}
    
      <Sheet open={isOpen} onOpenChange={setIsOpen}>

        <SheetContent side="left" className="w-[70%] sm:w-[70%]">
          <div className="w-[100%] mt-10">
          <ChatSection/>
          </div>
        </SheetContent>
      </Sheet>
      

      {/* Custom styles for vertical text */}
      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}