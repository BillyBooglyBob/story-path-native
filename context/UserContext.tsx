// Share the user state across the app using React Context API

import React, { createContext, useContext, useState, ReactNode } from "react";
import uuid from "react-native-uuid";

// Define the shape of your User state
type UserState = {
  uri?: string;
  username?: string;
}

type UserContextType = {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
};


// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Give each user a default unique username
  const defaultUserName = `user-${uuid.v4().slice(0, 8)}`;
  const [userState, setUserState] = useState<UserState>({
    username: defaultUserName,
  }); // Initialize with default values

  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};
