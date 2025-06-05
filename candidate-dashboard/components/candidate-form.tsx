"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Upload, MapPin, ChevronRight, ChevronLeft, Check } from "lucide-react"

const candidateFormSchema = z.object({
  // Step 1
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsappNumber: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
  isCallingNumber: z.enum(["Yes", "No"]),
  email: z.string().email({ message: "Please enter a valid email address." }),
  city: z.string().min(1, { message: "Please select your city." }),
  workRadius: z.string().min(1, { message: "Please select your work radius." }),

  // Step 2
  panNumber: z.string().min(10, { message: "Please enter a valid PAN number." }),
  aadharNumber: z.string().min(12, { message: "Please enter a valid Aadhar number." }),
  education: z.string().min(1, { message: "Please select your education level." }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

type CandidateFormValues = z.infer<typeof candidateFormSchema>

// This would come from your database in a real application
const defaultValues: Partial<CandidateFormValues> = {
  fullName: "",
  whatsappNumber: "",
  isCallingNumber: "Yes",
  email: "",
  city: "",
  workRadius: "",
  panNumber: "",
  aadharNumber: "",
  education: "",
  termsAccepted: false,
}

export function CandidateForm() {
  const [step, setStep] = useState(1)
  const [isEditing, setIsEditing] = useState(true)

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: CandidateFormValues) {
    // In a real application, you would send this data to your API
    toast({
      title: "Information submitted",
      description: "Your candidate information has been submitted successfully.",
    })
    setIsEditing(false)
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-3xl mx-auto relative z-10">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-2xl blur opacity-25"></div>
      <div className="glass-card p-6 md:p-8">
        <div className="mb-8 flex gap-2">
          <div className={`step-indicator flex-1 ${step >= 1 ? "step-indicator-active" : ""}`}></div>
          <div className={`step-indicator flex-1 ${step >= 2 ? "step-indicator-active" : ""}`}></div>
          <div className={`step-indicator flex-1 ${step >= 3 ? "step-indicator-active" : ""}`}></div>
        </div>
        <div className="mb-6 flex justify-between text-sm">
          <div className={step >= 1 ? "gradient-heading font-medium" : "text-slate-500"}>Step 1</div>
          <div className={step >= 2 ? "gradient-heading font-medium" : "text-slate-500"}>Step 2</div>
          <div className={step >= 3 ? "gradient-heading font-medium" : "text-slate-500"}>Step 3</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} className="glass-input" placeholder="Full Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 flex-col sm:flex-row">
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-slate-300">WhatsApp Number *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              className="glass-input"
                              placeholder="WhatsApp Number"
                            />
                          </FormControl>
                          <Button type="button" className="gradient-btn">
                            <span className="gradient-btn-content">
                              <span className="gradient-btn-text">Verify</span>
                            </span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isCallingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Is this WhatsApp number also your calling number?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                          disabled={!isEditing}
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" className="border-cyan-400 text-cyan-400" />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-300">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" className="border-cyan-400 text-cyan-400" />
                            </FormControl>
                            <FormLabel className="font-normal text-slate-300">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 flex-col sm:flex-row">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-slate-300">Email *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              disabled={!isEditing}
                              className="glass-input"
                              placeholder="Email"
                            />
                          </FormControl>
                          <Button type="button" className="gradient-btn">
                            <span className="gradient-btn-content">
                              <span className="gradient-btn-text">Verify</span>
                            </span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Select Your City *</FormLabel>
                      <div className="flex gap-2">
                        <Select disabled={!isEditing} onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass-input flex-1">
                              <SelectValue placeholder="Select Your City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-slate-700">
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Button type="button" variant="link" className="h-auto p-0 text-cyan-400 hover:text-cyan-300">
                          + Add Additional City
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workRadius"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-slate-300">Work Radius *</FormLabel>
                        <Button type="button" variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                          <span className="sr-only">Info</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-xs text-slate-400">
                            i
                          </div>
                        </Button>
                      </div>
                      <Select disabled={!isEditing} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select Work Radius" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-slate-700">
                          <SelectItem value="5km">Within 5 KM</SelectItem>
                          <SelectItem value="10km">Within 10 KM</SelectItem>
                          <SelectItem value="15km">Within 15 KM</SelectItem>
                          <SelectItem value="20km">Within 20 KM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">PAN Card *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="glass-input"
                          placeholder="Enter PAN Number"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="mt-4">
                        <FormLabel className="text-slate-300">Attach your pancard here</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload PAN
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Aadhar Number *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="glass-input"
                          placeholder="Enter Aadhar Number"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="mt-4">
                        <FormLabel className="text-slate-300">Attach your resume here*</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Aadhar
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Education *</FormLabel>
                      <Select disabled={!isEditing} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select Education Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-slate-700">
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                          className="border-slate-700 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-400 data-[state=checked]:to-violet-500 data-[state=checked]:border-transparent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-slate-300">
                          I have read and understood the{" "}
                          <Button variant="link" className="h-auto p-0 text-cyan-400 hover:text-cyan-300">
                            Terms & Conditions
                          </Button>{" "}
                          and the{" "}
                          <Button variant="link" className="h-auto p-0 text-cyan-400 hover:text-cyan-300">
                            Privacy Policy
                          </Button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="gradient-heading mb-4 text-xl font-bold">Review Your Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                        <p className="text-white">{form.getValues("fullName") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">WhatsApp Number</p>
                        <p className="text-white">{form.getValues("whatsappNumber") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Email</p>
                        <p className="text-white">{form.getValues("email") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">City</p>
                        <p className="text-white">{form.getValues("city") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Work Radius</p>
                        <p className="text-white">{form.getValues("workRadius") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">PAN Number</p>
                        <p className="text-white">{form.getValues("panNumber") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Aadhar Number</p>
                        <p className="text-white">{form.getValues("aadharNumber") || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Education</p>
                        <p className="text-white">{form.getValues("education") || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="gradient-btn">
                  <span className="gradient-btn-content">
                    <span className="gradient-btn-text">Continue</span>
                    <ChevronRight className="h-4 w-4 text-cyan-400" />
                  </span>
                </Button>
              ) : (
                <Button type="submit" className="gradient-btn">
                  <span className="gradient-btn-content">
                    <span className="gradient-btn-text">Submit Application</span>
                    <Check className="h-4 w-4 text-cyan-400" />
                  </span>
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

