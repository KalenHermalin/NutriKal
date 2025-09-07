import React from "react";

const ThemeContext = React.createContext({});

export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<"dark" | "light" | "system">(() => {
        // On first load, check localStorage or system
        if (typeof window !== "undefined") {
            if (localStorage.theme === "dark") return "dark";
            if (localStorage.theme === "light") return "light";
            return "system";
        }
        return "system";
    });

    React.useEffect(() => {

        let activeTheme = theme;
        if (theme === "system") {
            activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        if (activeTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }




        if (theme === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};