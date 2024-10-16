import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link } from 'react-router-dom';

const MenuItem = React.forwardRef(({ children, title, ...props }, forwardedRef) => (
  <div className="flex flex-col items-center w-full sm:w-80 mb-8">
    <NavigationMenu.Item>
      <NavigationMenu.Link asChild>
        <Link
          className="block w-full py-4 px-6 text-center bg-green9 hover:bg-green10 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green7 focus:ring-offset-2 focus:ring-offset-gray-800 mb-4"
          {...props}
          ref={forwardedRef}
        >
          {title}
        </Link>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
    <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">Animation for {children}</p>
    </div>
  </div>
));

function MainMenu() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex flex-wrap justify-center items-center gap-8 max-w-5xl">
          <MenuItem to="/hand-recognition" title="Hand Recognition">
            Hand Recognition
          </MenuItem>
          <MenuItem to="/pot-odds" title="Pot Odds Calculator">
            Pot Odds Calculator
          </MenuItem>
          <MenuItem to="/hand-range" title="Hand Range Estimator">
            Hand Range Estimator
          </MenuItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

export default MainMenu;
