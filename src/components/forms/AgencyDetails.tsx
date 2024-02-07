'use client'
import { Agency } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import { AlertDialog } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import FileUpload from '../global/FileUpload'
import { Input } from '../ui/input'
import { NumberInput } from '@tremor/react'
import { saveActivityLogsNotification, updateAgencyDetails } from '@/lib/queries'
import { Button } from '../ui/button'
import Loading from '../global/loading'


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
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Agency Name</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="Your agency name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Agency Email</FormLabel>
                                    <FormControl>
                                        <Input
                                        readOnly
                                        placeholder="Email"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="companyPhone"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Agency Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="Phone"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="123 st..."
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="City"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="State"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Zipcpde</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="Zipcode"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Country"
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {data?.id && (
                                <div className='flex flex-col gap-2'>
                                    <FormLabel>
                                        Create a Goal
                                    </FormLabel>
                                    <FormDescription>
                                        ✨ Create a goal for your agency. As your business grows
                                        your goals grow too so dont forget to set the bar higher!
                                    </FormDescription>
                                    <NumberInput
                                        defaultValue={data?.goal}
                                        onValueChange = {async (val)=>{
                                            if (!data?.id) return
                                            await updateAgencyDetails(data.id, { goal: val })
                                            await saveActivityLogsNotification({
                                            agencyId: data.id,
                                            description: `Updated the agency goal to | ${val} Sub Account`,
                                            subaccountId: undefined,
                                            })
                                            router.refresh()
                                        }}
                                        min = {1}
                                        className='bg-background !border !border-input'
                                        placeholder='Sub Account Goal'
                                    
                                    />
                                </div>
                            )}
                           
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AlertDialog>
    
  )
}

export default AgencyDetails