import React from "react";
// core components
import Select from "react-select";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function Lancamento({
  date,
  end,
  name,
  brands,
  selectedBrands,
  setDate,
  setEnd,
  setName,
  selectBrand,
}) {
  return (
    <>
      <Card>
        <CardHeader color="primary">
          <h4 style={{ color: "#000" }}>Informações do Drop</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Select
                options={brands}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={selectedBrands}
                onChange={(e) => {
                  selectBrand(e);
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                labelText="Nome"
                value={name}
                onChangeText={(e) => {
                  setName(e);
                }}
                id="username"
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}></GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <p>Início</p>
              <input
                type="datetime-local"
                className="date-input"
                value={date}
                max={end}
                onChange={(e) => setDate(e)}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <p>Fim</p>
              <input
                type="datetime-local"
                className="date-input"
                value={end}
                min={date}
                onChange={(e) => setEnd(e)}
              />
            </GridItem>
          </GridContainer>
          <br />
        </CardBody>
      </Card>
    </>
  );
}
