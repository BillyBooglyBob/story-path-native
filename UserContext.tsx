// Share the user state across the app using React Context API

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your User state
interface UserState {
  uri?: string;
  username?: string;
}

// Create the context
const UserContext = createContext<
  | {
      userState: UserState;
      setUserState: React.Dispatch<React.SetStateAction<UserState>>;
    }
  | undefined
>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<UserState>({ username: "" }); // Initialize with default values

  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
