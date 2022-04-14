import React, { useState, useContext } from "react";

const SpaceViewerContext = React.createContext();
const UpdateSpaceViewerContext = React.createContext();

export const useSpaceViewer = () => {
  return useContext(SpaceViewerContext);
};

export const useUpdateSpaceViewer = () => {
  return useContext(UpdateSpaceViewerContext);
};

export const SpaceViewerProvider = ({ value, children }) => {
  const [spaceViewer, setSpaceViewer] = useState(value);
  return (
    <SpaceViewerContext.Provider value={spaceViewer}>
      <UpdateSpaceViewerContext.Provider value={setSpaceViewer}>
        {children}
      </UpdateSpaceViewerContext.Provider>
    </SpaceViewerContext.Provider>
  );
};