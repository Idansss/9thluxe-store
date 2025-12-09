import { Check } from "lucide-react"

import { cn } from "@/lib/utils"



interface CheckoutStepsProps {

  currentStep: number

}



const steps = [

  { id: 1, name: "Shipping" },

  { id: 2, name: "Payment" },

  { id: 3, name: "Review" },

]



export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {

  return (

    <nav aria-label="Checkout progress" className="mb-8">

      <ol className="flex items-center">

        {steps.map((step, index) => (

          <li key={step.id} className={cn("flex items-center", index !== steps.length - 1 && "flex-1")}>

            <div className="flex items-center">

              <span

                className={cn(

                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",

                  step.id < currentStep

                    ? "bg-primary border-primary text-primary-foreground"

                    : step.id === currentStep

                      ? "border-primary text-primary"

                      : "border-border text-muted-foreground",

                )}

              >

                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}

              </span>

              <span

                className={cn(

                  "ml-3 text-sm font-medium hidden sm:block",

                  step.id <= currentStep ? "text-foreground" : "text-muted-foreground",

                )}

              >

                {step.name}

              </span>

            </div>

            {index !== steps.length - 1 && (

              <div className={cn("flex-1 h-0.5 mx-4 sm:mx-6", step.id < currentStep ? "bg-primary" : "bg-border")} />

            )}

          </li>

        ))}

      </ol>

    </nav>

  )

}
