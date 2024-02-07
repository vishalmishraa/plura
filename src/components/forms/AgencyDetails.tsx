'use client'
import { Agency } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import { AlertDialog } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import FileUpload from '../global/FileUpload'
import { Input } from '../ui/input'


type Props = {
    data?: Partial<Agency>
}

//zod configuration
const FormSchema = z.object({
    name: z.string().min(2, { message: 'Agency name must be atleast 2 charecters.' }),
    companyEmail: z.string().min(1),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
  })

const handleSubmit = (data: any) => {};




const AgencyDetails = ({data}: Props) => {
    const {toast} = useToast();
    const router = useRouter();
    const [deletingAgency , setDeleteingAgency] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        mode:"onChange",
        resolver:zodResolver(FormSchema),//zod resolver configuration
        defaultValues: {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel || false,
            address: data?.address,
            city: data?.city,
            zipCode: data?.zipCode,
            state: data?.state,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
          },
    });
    const isLoading = form.formState.isSubmitting;

    //it needed to reset the form when data is changed
    useEffect(()=>{
        if(data){
            form.reset(data);
        }
    },[data]);// eslint-disable-line

  return (
    
        <AlertDialog>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>
                        Agency Information
                    </CardTitle>
                    <CardDescription>
                    Lets create an agency for you business. You can edit agency settings
                    later from the agency settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit = {form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="agencyLogo"
                                render ={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Agency Logo
                                        </FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndpoint='agencyLogo'
                                                onChange={field.onChange}
                                                value={field.value}
                                            
                                            ></FileUpload>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AlertDialog>
    
  )
}

export default AgencyDetails