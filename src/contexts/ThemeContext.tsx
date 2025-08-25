import React from "react";

export const ThemeContext = React.createContext({
})

export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<"dark" | "light" | "system">("system");
    
    React.useEffect(() => {

        document.documentElement.classList.toggle("dark",
            localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
        );
    }, [theme])
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}