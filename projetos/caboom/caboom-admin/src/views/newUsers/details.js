import React from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

export default function Details({ data }) {
  return (
    <>
      <GridContainer style={{ width: "60vw", overflowX: "hidden" }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
      </GridContainer>
    </>
  );
}
