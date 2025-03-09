"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const TopCenterToastProvider = ToastPrimitives.Provider

const TopCenterToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen flex-col-reverse gap-2",
      "w-full sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
TopCenterToastViewport.displayName = "TopCenterToastViewport"

const TopCenterToast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
TopCenterToast.displayName = "TopCenterToast"

// 定义Toast样式
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// 其他Toast组件
const TopCenterToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
TopCenterToastTitle.displayName = "TopCenterToastTitle"

const TopCenterToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
TopCenterToastDescription.displayName = "TopCenterToastDescription"

const TopCenterToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 focus:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
TopCenterToastClose.displayName = "TopCenterToastClose"

// 顶部居中Toast组件
export function TopCenterToaster() {
  const { toasts } = useToast()

  return (
    <TopCenterToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <TopCenterToast key={id} {...props}>
            <div className="grid gap-1 w-full">
              {title && <TopCenterToastTitle>{title}</TopCenterToastTitle>}
              {description && (
                <TopCenterToastDescription>{description}</TopCenterToastDescription>
              )}
            </div>
            {action}
            <TopCenterToastClose />
          </TopCenterToast>
        )
      })}
      <TopCenterToastViewport />
    </TopCenterToastProvider>
  )
}

// 然后在app/layout.tsx中使用这个组件替换原来的Toaster
