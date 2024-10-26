import React, { useEffect, useState } from 'react';
import UsersList from '@components/UsersList';
import useSWR from 'swr';
import getUsers from '@api/users';
import { UserIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import Sound from '@assets/noun-sound-4888408.svg?react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { SignOutButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

type Props = {};

const TopBar = (props: Props) => {
  return (
    <nav className="container mx-auto flex justify-between py-8">
      <Sound className="h-12 fill-brand-lime " />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            <UserIcon height={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Cog6ToothIcon height={17} className="mr-1.5" />
              <Link to={'/dashboard/settings'}>Profile Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArrowLeftStartOnRectangleIcon height={17} className="mr-1.5" />
            <SignOutButton>Log out</SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default TopBar;
