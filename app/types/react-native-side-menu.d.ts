declare module 'react-native-side-menu' {
  import React from 'react';
  interface SideMenuProps {
    menu: React.ReactNode
    isOpen?: boolean
    openMenuOffset?: number
    hiddenMenuOffset?: number
    edgeHitWidth?: number
    toleranceX?: number
    toleranceY?: number
    disableGestures?: boolean
    onChange?: (isOpen: boolean) => void
    onMove?: () => void
    onSliding?: () => void
    menuPosition?: 'left' | 'right'
    animationFunction?: () => Object
    onAnimationComplete?: () => void
    animationStyle?: () => Object
    bounceBackOnOverdraw?: boolean
    autoClosing?: boolean
  }
  class SideMenu extends React.Component<SideMenuProps, any> { }
  export = SideMenu
}