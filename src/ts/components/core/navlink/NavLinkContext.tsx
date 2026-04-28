import React, {  createContext } from 'react';

// This context allows children to report their active status to parents

const NavLinkContext = createContext<{
    onChildActive?: (id: string, isActive: boolean) => void;
} | null>(null);

export default NavLinkContext;
