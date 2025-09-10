"use client";
import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const Layout = (props: {
  header?: React.ReactNode;
  sidenav?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, [headerRef]);
  return (
    <>
      <Box ref={headerRef} w="100%">
        {props.header}
      </Box>
      <HStack
        gap="0"
        w="100%"
        h={`calc(100vh - ${headerHeight}px)`}
        align="stretch"
      >
        <Box h="100%" p={0} borderRightWidth="1px">
          {props.sidenav}
        </Box>
        <PanelGroup
          autoSaveId="layout"
          direction="horizontal"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {props.sidebar && (
            <>
              <Panel defaultSize={50} minSize={25} style={{ overflow: "auto" }}>
                {props.sidebar}
              </Panel>
              <PanelResizeHandle
                style={{
                  width: "10px",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "col-resize",
                }}
              >
                <Box
                  bg={"bg.emphasized"}
                  w="100%"
                  h="100%"
                  cursor="col-resize"
                  shadow="md"
                ></Box>
                <Box
                  w="4px"
                  h="50%"
                  borderRadius="md"
                  position="absolute"
                  transform="translate(0, 50%)"
                  bg={"bg.inverted"}
                />
              </PanelResizeHandle>
            </>
          )}
          <Panel minSize={20} style={{ overflow: "auto" }}>
            {props.children}
          </Panel>
        </PanelGroup>
      </HStack>
    </>
  );
};
