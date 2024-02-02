import React from 'react'
import {currentUser} from '@clerk/nextjs'
import { redirect} from 'next/navigation';

const AgencyPage = async() => {
  const authUser = await currentUser();
  if(!authUser) return redirect('/sign-in');
  return (
    <div>
      Agency page
    </div>
  )
}

export default AgencyPage
