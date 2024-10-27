import React from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { Switch } from '@components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useStore from '@store';
import { useClerkMutation } from '@api/useClerkSWR';
import { useToast } from '@hooks/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';

type Props = {};

const FormSchema = z.object({
  socialUrl: z.string().url().or(z.literal('')).optional(),
  showSpotifyUrl: z.boolean().optional(),
});

const UpdateProfileSheet = (props: Props) => {
  const { toast } = useToast();
  const { user, setUser } = useStore();
  const { trigger, isMutating, error } = useClerkMutation('/user/update', 'put');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      socialUrl: user?.socialUrl || '',
      showSpotifyUrl: user?.preferences?.privacySettings?.showSpotifyUrl ?? false,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const { data } = await trigger({
        showSpotifyUrl: values.showSpotifyUrl,
        ...(values.socialUrl && { socialUrl: values.socialUrl }),
      });
      setUser(data?.updatedUser);
      toast({
        title: 'User was updated',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Update your profile here.</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="socialUrl"
            render={({ field }) => (
              <FormItem className="flex items-baseline gap-4">
                <FormLabel htmlFor="socialUrl" className="basis-1/3">
                  Social media
                </FormLabel>
                <div>
                  <Input
                    {...field}
                    error={!!form.formState.errors.socialUrl}
                    placeholder="Url"
                    id="socialUrl"
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showSpotifyUrl"
            render={({ field }) => (
              <FormItem className="flex items-baseline gap-4">
                <Label htmlFor="show-url" className="basis-1/3">
                  Show spotify url
                </Label>
                <FormControl>
                  <Switch id="show-url" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit" disabled={isMutating}>
              {isMutating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};

export default UpdateProfileSheet;
