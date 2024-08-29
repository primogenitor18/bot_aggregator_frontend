'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface IBarMenuProps {
  menuAnchor: null | HTMLElement
  openMenu: boolean
  handleClose: any 
}

export default function BarMenu(props: IBarMenuProps) {
  const router = useRouter()

  return (
    <Menu
      id="basic-menu"
      anchorEl={props.menuAnchor}
      open={props.openMenu}
      onClose={props.handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem><Link href="/">Main</Link></MenuItem>
      <MenuItem><Link href="/tasks">Tasks</Link></MenuItem>
    </Menu>
  );
}
