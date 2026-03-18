import type { FC } from 'react';

import type { NavDrawerProps } from './nav-drawer.types';

import Divider from '@/components/atoms/divider/Divider';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import { List, ListItemText } from '@/components/atoms/list/List';
import NavItem from '@/components/atoms/nav-item/NavItem';
import Toolbar from '@/components/atoms/toolbar/Toolbar';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

import { ADMIN_NAV_ITEMS, NAV_ITEMS } from './nav-drawer.constants';

const NavDrawer: FC<NavDrawerProps> = ({ pathname, onNavigate, isAdmin, userProfile }) => {
  return (
    <Wrapper sx={{ display: 'flex', flexDirection: 'column', blockSize: '100%' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Icon name="AccessibilityNew" color="primary" />
        <Heading
          tag="h6"
          fontWeight={700}
          sx={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          A11y Auditor
        </Heading>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, paddingBlockStart: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={<Icon name={item.iconName} />}
            selected={pathname === item.path}
            onClick={() => onNavigate(item.path)}
          />
        ))}
        {isAdmin ? (
          <>
            <Divider sx={{ marginBlock: 1 }} />
            <ListItemText
              primary="Administration"
              sx={{ paddingInlineStart: 2, paddingBlockStart: 1 }}
              slotProps={{
                primary: {
                  variant: 'caption',
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                },
              }}
            />
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={<Icon name={item.iconName} />}
                selected={pathname === item.path}
                onClick={() => onNavigate(item.path)}
              />
            ))}
          </>
        ) : null}
      </List>
      <Divider />
      {userProfile}
    </Wrapper>
  );
};

export default NavDrawer;
