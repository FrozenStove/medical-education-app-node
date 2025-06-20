import React, { useState } from 'react';
import Scripts from './Scripts';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="sidebar-toggle" onClick={onToggle}>
                {isOpen ? 'X' : '☰'}
            </button>
            <div className="sidebar-content">
                <Scripts />
            </div>
        </div>
    );
}

export default Sidebar; 