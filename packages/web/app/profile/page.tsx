'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/api/auth";
import { useTranslations } from "next-intl";

// Form validation schema
const profileFormSchema = (t: any) => z.object({
  name: z.string().min(2, { message: t('profile.form.validation.nameRequired') }),
  email: z.string().email({ message: t('profile.form.validation.emailInvalid') }),
  avatarUrl: z.string().url({ message: t('profile.form.validation.avatarUrlInvalid') }).optional().or(z.literal(''))
});

type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>;

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      avatarUrl: ""
    }
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || ""
      });
    }
  }, [user, form]);

  // Handle submit
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(user.userId, {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || undefined
      });

      toast({
        title: t('profile.notifications.updateSuccess'),
        description: t('profile.notifications.updateSuccessDesc')
      });
    } catch (error) {
      toast({
        title: t('profile.notifications.updateFailed'),
        description: error instanceof Error ? error.message : "Unable to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.notLoggedIn')}</CardTitle>
            <CardDescription>{t('profile.loginRequired')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.href = '/login'}>{t('profile.goToLogin')}</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Avatar className="h-20 w-20 mr-6">
            <AvatarImage src={user.avatarUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.title')}</CardTitle>
            <CardDescription>
              {t('profile.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.form.username')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.form.email')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.form.avatarUrl')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('profile.form.avatarPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('profile.form.saving')}
                    </>
                  ) : (
                    t('profile.form.saveChanges')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
