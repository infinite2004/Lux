import { Outlet } from 'react-router';
import { NavigationMenu } from './navigation-menu';

export function Layout() {
  return (
    <div
      className="max-w-md mx-auto overflow-x-hidden"
      style={{
        minHeight: '100svh',
        background: '#F5F2EC',
        position: 'relative',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <Outlet />
      <NavigationMenu />
    </div>
  );
}
