"use client";

import { useEffect, useRef } from "react";
import { useLayout } from "@/app/context/LayoutContext";

import SidebarMenu from "@/app/components/sidebar/SidebarMenu"


export default function Sidebar({className, }) {

    const sidebarRef = useRef(null);

    const {
        sidebarOpen,
        setSidebarWidth,
    } = useLayout();

    useEffect(() => {
        if (!sidebarRef.current) return;

        const width = getComputedStyle(sidebarRef.current).width;
        const widthPureInt = parseInt(width);
        setSidebarWidth(widthPureInt);
        // console.log("setSidebarWidth(width);",width);
    }
    ,[setSidebarWidth]);

    return (
        <div
            ref={sidebarRef}
            style={{ width: "var(--sidebar-width)" }}
            className={`
                ${sidebarOpen ? "" : "hidden"}
                ${className}
            `}
        >
        
                <SidebarMenu />
        </div>
    );
}