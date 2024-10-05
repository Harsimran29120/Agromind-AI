import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const footerNavs = [
   {
      label: 'Product',
      items: [
         {
            href: '/',
            name: 'Some link',
         },
         {
            href: '/',
            name: 'Some link',
         },
         {
            href: '/faq',
            name: 'FAQ',
         },
      ],
   },

   {
      label: 'Company',
      items: [
         {
            href: '/',
            name: 'Terms',
         },
         {
            href: '/',
            name: 'Privacy',
         },
         {
            href: 'mailto:hello@gmail.com',
            name: 'Email',
         },
      ],
   },
   
]


export function SiteFooter() {
   return (
      <footer>
         <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
            <div className="gap-4 p-4 px-8 py-16 sm:pb-16 md:flex md:justify-between">
               <div className="mb-12 flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-2">
                     
                     <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                        Farmers AI
                     </span>
                  </Link>
                  <p className="max-w-xs">AI tool for farmers</p>
               </div>
               <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
                  {footerNavs.map(nav => (
                     <div key={nav.label}>
                        <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-gray-900 dark:text-white">
                           {nav.label}
                        </h2>
                        <ul className="grid gap-2">
                           {nav.items.map(item => (
                              <li key={item.name}>
                                 <Link
                                    href={item.href}
                                    className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                                 >
                                    {item.name}
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-2 rounded-md border-neutral-700/20 px-8 py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
               <div className="flex space-x-5 sm:mt-0 sm:justify-center">
                 
               </div>
               <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                  Copyright ©
                  {' '}
                  {new Date().getFullYear()}
                  {' '}
                  <Link href="/" className="cursor-pointer">
                     Farmers AI
                  </Link>
                  . All Rights Reserved.
               </span>
            </div>
         </div>
         {/*   <SiteBanner /> */}
      </footer>
   )
}
