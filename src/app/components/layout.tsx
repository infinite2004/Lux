import { Outlet } from 'react-router';
import { NavigationMenu } from './navigation-menu';

export function Layout() {
  return (
    <div style={{ minHeight: '100svh', background: '#F5F2EC' }}>
      <Outlet />
      <NavigationMenu />
    </div>
  );
}
