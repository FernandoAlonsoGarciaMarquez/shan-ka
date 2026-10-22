"use client";

import {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect
} from "react";


const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {


    // allTabs прокидываем из useAllTabs хука..
    const [ allTabsHook, setAllTabsHook ] = useState([]);


    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(0);

    // Left Toolbar
    const [leftToolbarWidth, setLeftToolbarWidth] = useState(0);

    // Viewport
    const [viewportWidth, setViewportWidth] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    // is loading the main page content?
    const [isLoading, setIsLoading] = useState(true);


        // вычисляемые значения
    const contentOffsetLeft =
        (sidebarOpen ? sidebarWidth : 0);


    // const contentWidth =
    //     (viewportWidth/100*90) - contentOffsetLeft;

        const contentWidth =
        viewportWidth - contentOffsetLeft;
        

    const [currentTab, setCurrentTab] = useState(undefined);  
    const [activeTabId, setActiveTabId] = useState(1);

    const [ oldHskLevel, setOldHskLevel ] = useState('0');

    const [ allJsonsFetched, setAllJsonsFetched ] = useState(false);
    const [ firstJsonsFetched, setFirstJsonsFetched ] = useState(false);


    const value = useMemo(() => ({

        allTabsHook, 
        setAllTabsHook,


        contentOffsetLeft,
        contentWidth,

        sidebarOpen,
        setSidebarOpen,

        sidebarWidth,
        setSidebarWidth,

        leftToolbarWidth,
        setLeftToolbarWidth,

        viewportWidth,
        setViewportWidth,

        viewportHeight,
        setViewportHeight,

        isLoading, 
        setIsLoading,

        // для проверки, нужно ли обновлять картовчки в useEffect
        oldHskLevel, 
        setOldHskLevel,

        activeTabId, 
        setActiveTabId,

        currentTab, 
        setCurrentTab,

        allJsonsFetched, 
        setAllJsonsFetched,

        firstJsonsFetched, 
        setFirstJsonsFetched,


    }), [

        allTabsHook, 
        setAllTabsHook,


        sidebarOpen,
        sidebarWidth,
        leftToolbarWidth,
        viewportWidth,
        viewportHeight,
        isLoading,
        setIsLoading,
        oldHskLevel, 
        setOldHskLevel,
        contentOffsetLeft,
        contentWidth,
        activeTabId, 
        setActiveTabId,
        currentTab, 
        setCurrentTab,

        allJsonsFetched, 
        setAllJsonsFetched,

        firstJsonsFetched, 
        setFirstJsonsFetched,


    ]);

    // Layout Watcher --------------------------------------------
    useEffect(() => {

        function updateViewport() {
            // console.log(window.innerWidth);

            setViewportWidth(window.innerWidth);
            setViewportHeight(window.innerHeight);
            // console.log('LayoutContext Viewport Width:',viewportWidth);
        }

        updateViewport();

        

        window.addEventListener("resize", updateViewport);

        return () =>
            window.removeEventListener("resize", updateViewport);

    }, [
    ]);
    // Layout Watcher --------------------------------------------

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);

    if (!context)
        throw new Error("useLayout must be used inside LayoutProvider");

    return context;
}