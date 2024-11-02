import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Sound from '@assets/icons/noun-sound-4888408.svg?react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import useStore from '@store';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useClerkMutation } from '@api/useClerkSWR';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialog,
} from '@components/ui/alert-dialog';

import { z } from 'zod';
import { error } from 'console';

interface Props {
  open: boolean;
}

const formSchema = z.object({
  socialUrl: z.string(),
});

const FinishSignIn = ({ open }: Props) => {
  const { accessToken, setUser } = useStore();
  const { error, trigger, isMutating } = useClerkMutation('/auth/sign-in', 'post');
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!accessToken) return;
    try {
      const { data } = await trigger(values);
      setUser(data);
      navigate('/dashboard');
    } catch (error) {
      form.setError('socialUrl', { type: 'custom', message: error?.response?.data?.message });
      console.error(error);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-8">
        <div className="text-center pt-0">
          <Sound className="h-16 w-16 fill-brand-lime mx-auto" />
          <CardTitle className="text-xl text-brand-gray-100">Link a social media</CardTitle>
          <CardDescription>So people can chat you</CardDescription>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="socialUrl"
              render={({ field }) => (
                <div className="mb-6">
                  <FormControl>
                    <Input placeholder="Social url (optional)" {...field} className="mx-auto w-3/4" />
                  </FormControl>
                  <FormMessage className="mt-2 text-center" /> {/* Message moved below the Input */}
                  <div className="flex justify-center mt-4">
                    <Button type="submit" disabled={isMutating}>
                      {isMutating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            />
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FinishSignIn;
