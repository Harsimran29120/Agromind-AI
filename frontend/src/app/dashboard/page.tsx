import ChatSection from "@/components/chat";
import SideDrawer from "@/components/drawer";
import { auth, currentUser } from "@clerk/nextjs/server"


export default async function Dashboard() {
    const { userId } = auth();
    // console.log(userId);
    const user = await currentUser();


    if (!userId || !user) {
        return <div>You're not logged in</div>
    }

    // console.log(user);

    return (
   <div className="text-2xl font-font mx-auto text-center mt-20">
    {/* <span>{user?.firstName}</span> <br />
    <span>{user?.lastName}</span> <br />
    <span>{user?.emailAddresses[0].emailAddress}</span> */}
    <SideDrawer/>
    
    
    

   </div>
  )
}