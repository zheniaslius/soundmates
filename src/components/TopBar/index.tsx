import React, { useEffect, useState } from 'react';
import UsersList from '@components/UsersList';
import useSWR from 'swr';
import getUsers from '@api/users';
import { UserIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Sound from '@assets/noun-sound-4888408.svg?react';
import { SheetTrigger } from '@components/ui/sheet';
import { Button } from '@components/ui/button';
import { SignOutButton, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

type Props = {};

const TopBar = (props: Props) => {
  const { signOut } = useAuth();

  return (
    <nav className="container mx-auto flex justify-between py-8">
      <Sound className="h-12 fill-brand-lime " />
      <div className="flex items-center">
        <SheetTrigger asChild>
          <Button variant={'ghost'}>
            <UserIcon height={22} />
          </Button>
        </SheetTrigger>
        <Button variant={'ghost'} onClick={() => signOut()}>
          <ArrowLeftStartOnRectangleIcon height={22} className="text-red-500" />
        </Button>
      </div>
    </nav>
  );
};

export default TopBar;
