import React from 'react'
import {currentUser} from '@clerk/nextjs'
import { redirect} from 'next/navigation';
import { getAuthUserDetails , verifyAndAcceptInvitation } from '@/lib/queries';
import { Plan } from '@prisma/client';
import AgencyDetails from '@/components/forms/AgencyDetails';
import Navigation from '@/components/site/navigation';

/**
 * Renders the AgencyPage component.
 * 
 * @param searchParams - The search parameters for the page.
 * @returns The rendered AgencyPage component.
 */

const AgencyPage = async({searchParams}:{searchParams : {plan: Plan ; state:string ; code:string}}) => {

  const agencyId = await verifyAndAcceptInvitation();
  console.log(agencyId);
  

  const user = await getAuthUserDetails();
  
  if(agencyId){
    if(user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER'){ return redirect('/subaccount')}
    else if(user?.role === "AGENCY_OWNER"|| user?.role=== 'AGENCY_ADMIN'){
        if(searchParams.plan){
            return redirect(`/agency/${agencyId}/building?plan=${searchParams.plan}`);
        }
        if(searchParams.state){
            const statePath = searchParams.state.split('___')[0]
            const stateAgencyId = searchParams.state.split('___')[1]
            if(!stateAgencyId) return <div>Not Authorised</div>
            return redirect(`/agenxcy/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
        }else{
            return redirect(`/agency/${agencyId}`)
        }
    }else{
        return <div>Not Authoried</div>
    } 
  }
/**
 * Retrieves the current authenticated user.
 * @returns {Promise<User>} A promise that resolves to the authenticated user.
 */
const authUser = await currentUser();

  return (
    <div>
    <Navigation/>
    <div className='flex justify-center items-center mt-4'>
        <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
            <h1 className='text-4xl pb-4'>
                Create An Agency
            </h1>
            <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
        </div>
    </div>
    </div>
  )
}


export default AgencyPage
