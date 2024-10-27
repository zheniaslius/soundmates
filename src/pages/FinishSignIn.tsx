import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Sound from '@assets/noun-sound-4888408.svg?react';
import { postFetcher } from '@api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useStore from '@store';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useClerkMutation } from '@api/useClerkSWR';

import { z } from 'zod';

const formSchema = z.object({
  socialUrl: z.string(),
});

const FinishSignIn = (props: Props) => {
  const { accessToken, setUser } = useStore();
  const { trigger, isMutating } = useClerkMutation('/auth/sign-in', 'post');
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
    <Card className="card">
      <CardHeader className="text-center pt-0">
        <Sound className="h-16 w-16 fill-brand-lime mx-auto" />
        <CardTitle className="text-xl text-brand-gray-100">Link a social media</CardTitle>
        <CardDescription>So people can chat you</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="socialUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Social url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isMutating}>
              {isMutating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FinishSignIn;
