import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import {
  AppState,
  SavedPraise,
  loadState,
  saveState,
  generateId,
  THEMES,
  Theme,
  getRandomTheme,
} from "./store";
import { trackNickname, trackPageView, getVisitorId } from "./analytics";

interface AppContextType {
  state: AppState;
  isLoading: boolean;
  visitorId: string | null;
  setNickname: (nickname: string) => void;
  setDefaultTheme: (themeId: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  addPraise: (praise: Omit<SavedPraise, "id" | "createdAt">) => void;
  removePraise: (id: string) => void;
  incrementEchoCount: () => void;
  getDefaultTheme: () => Theme;
  getThemeById: (id: string) => Theme | undefined;
  getActualTheme: (themeId: string) => Theme;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    nickname: "朋友",
    defaultThemeId: "random",
    savedPraises: [],
    resonanceCount: 0,
    echoCount: 0,
    onboardingComplete: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [visitorId, setVisitorId] = useState<string | null>(null);

  // 加载初始状态和访客 ID
  useEffect(() => {
    Promise.all([loadState(), getVisitorId()]).then(([loadedState, vid]) => {
      setState(loadedState);
      setVisitorId(vid);
      setIsLoading(false);
      
      // 记录首页访问
      trackPageView("/");
    });
  }, []);

  // 保存状态变化
  const updateState = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState);
  }, []);

  const setNickname = useCallback(
    (nickname: string) => {
      updateState({ ...state, nickname });
      // 埋点：记录昵称设置
      trackNickname(nickname);
    },
    [state, updateState]
  );

  const setDefaultTheme = useCallback(
    (themeId: string) => {
      updateState({ ...state, defaultThemeId: themeId });
    },
    [state, updateState]
  );

  const setOnboardingComplete = useCallback(
    (complete: boolean) => {
      updateState({ ...state, onboardingComplete: complete });
    },
    [state, updateState]
  );

  const addPraise = useCallback(
    (praise: Omit<SavedPraise, "id" | "createdAt">) => {
      const newPraise: SavedPraise = {
        ...praise,
        id: generateId(),
        createdAt: Date.now(),
      };
      const newResonanceCount =
        praise.type === "self" || praise.type === "highlight"
          ? state.resonanceCount + 1
          : state.resonanceCount;
      updateState({
        ...state,
        savedPraises: [newPraise, ...state.savedPraises],
        resonanceCount: newResonanceCount,
      });
    },
    [state, updateState]
  );

  const removePraise = useCallback(
    (id: string) => {
      const praise = state.savedPraises.find((p) => p.id === id);
      if (!praise) return;
      const newResonanceCount =
        praise.type === "self" || praise.type === "highlight"
          ? Math.max(0, state.resonanceCount - 1)
          : state.resonanceCount;
      updateState({
        ...state,
        savedPraises: state.savedPraises.filter((p) => p.id !== id),
        resonanceCount: newResonanceCount,
      });
    },
    [state, updateState]
  );

  const incrementEchoCount = useCallback(() => {
    updateState({ ...state, echoCount: state.echoCount + 1 });
  }, [state, updateState]);

  const getDefaultTheme = useCallback(() => {
    return THEMES.find((t) => t.id === state.defaultThemeId) || THEMES[0];
  }, [state.defaultThemeId]);

  const getThemeById = useCallback((id: string) => {
    return THEMES.find((t) => t.id === id);
  }, []);

  // 获取实际主题（如果是随机则返回随机主题）
  const getActualTheme = useCallback((themeId: string) => {
    if (themeId === "random") {
      return getRandomTheme();
    }
    return THEMES.find((t) => t.id === themeId) || THEMES[0];
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        isLoading,
        visitorId,
        setNickname,
        setDefaultTheme,
        setOnboardingComplete,
        addPraise,
        removePraise,
        incrementEchoCount,
        getDefaultTheme,
        getThemeById,
        getActualTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
