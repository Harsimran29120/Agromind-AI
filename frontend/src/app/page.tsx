import Image from "next/image";
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import PricingSection from "@/components/pricing";
import CallToActionSection from "@/components/design";
import { SiteFooter } from "@/components/footer";
import Particles from "@/components/ui/particles";
import { SphereMask } from "@/components/ui/sphere-mask";


export default function Home() {
  return (
    <div>
    <section
         id="hero"
         className="relative mx-auto mt-32 max-w-7xl px-6 text-center md:px-8"
      >
        
    <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/10 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
            Farmers AI is the new
            <br className="hidden md:block" />
            {' '}
            way to monitor your crops
         </h1>
         <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
         bla bla bla bl bla bla bla bl bla bla bla bl bla bla bla bl            <br className="hidden md:block" />
            {' '}
            bla bla bla bla
         </p>
         <Button className="animate-fade-in -translate-y-4 gap-1 rounded-lg text-white ease-in-out [--animation-delay:600ms] dark:text-black">
            <span>Get Started for free </span>
            <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
         </Button>


         <div
           
           className="animate-fade-up relative mt-32 [--animation-delay:400ms] [perspective:2000px] after:absolute  after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
        >
           <div
              className={`rounded-xl border border-white/10 bg-white  before:absolute before:bottom-1/2 before:left-0 before:top-0 before:size-full  before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:[filter:blur(130px)] }`}
           >
              <BorderBeam
                 size={200}
                 duration={12}
                 delay={11}
                 colorFrom="var(--color-one)"
                 colorTo="var(--color-two)"
              />

              <img
                 src="https://www.opendatasoft.com/wp-content/uploads/2023/03/Blog-thumbnail-1.png"
                 alt="Hero Image"
                 className="relative hidden size-full rounded-[inherit] border object-contain dark:block"
              />
              <img
                 src="https://www.opendatasoft.com/wp-content/uploads/2023/03/Blog-thumbnail-1.png"
                 alt="Hero Image"
                 className="relative block size-full rounded-[inherit]  border object-contain dark:hidden"
              />
           </div>
        </div>

        <section
         id="clients"
         className="mx-auto max-w-7xl px-6 text-center md:px-8"
      >
         <div className="py-14">
            <div className="mx-auto max-w-screen-xl px-4 md:px-8">
               <h2 className="text-center text-sm font-semibold text-gray-600">
                  TRUSTED BY TEAMS FROM AROUND THE WORLD
               </h2>
               <div className="mt-6">
                  <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&_path]:fill-white">
                     <li>
                        <Image
                           alt="Google"
                           src="https://cdn.nyxbui.design/companies/Google.svg"
                           className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                           width={28}
                           height={8}
                        />
                     </li>
                     <li>
                        <Image
                           alt="Microsoft"
                           src="https://cdn.nyxbui.design/companies/Microsoft.svg"
                           className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                           width={28}
                           height={8}
                        />
                     </li>
                     <li>
                        <Image
                           alt="GitHub"
                           src="https://cdn.nyxbui.design/companies/GitHub.svg"
                           className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                           width={28}
                           height={8}
                        />
                     </li>

                     <li>
                        <Image
                           alt="Uber"
                           src="https://cdn.nyxbui.design/companies/Uber.svg"
                           className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                           width={28}
                           height={8}
                        />
                     </li>
                     <li>
                        <Image
                           alt="Notion"
                           src="https://cdn.nyxbui.design/companies/Notion.svg"
                           className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                           width={28}
                           height={8}
                        />
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>
      <SphereMask />
      <PricingSection />
      
         </section>
         <CallToActionSection />
         <Particles
            className="absolute inset-0 -z-10"
            quantity={100}
            ease={70}
            size={1}
            staticity={40}
            color="#ffffff"
         />
         <SiteFooter />
         </div>
  );
}
