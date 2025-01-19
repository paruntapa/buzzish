import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem(("buzzish-theme") || "coffee"),
    setTheme: (theme) => {
        localStorage.setItem("buzzish-theme", theme);
        set({theme});
    },
}));