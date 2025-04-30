import React, { useState, useEffect } from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/AddCircleRounded";
import IconButton from "@material-ui/core/IconButton";
import firebase from "./../../initFirebase";
import Loader from "react-loader-spinner";
import Button from "components/CustomButtons/Button.js";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { NavLink } from "react-router-dom";

// core components
import stylesTable from "assets/jss/material-dashboard-react/components/tableStyle.js";

export default function Lancamentos() {
  const useStylesTable = makeStyles(stylesTable);
  const classesTable = useStylesTable();
  const [projects, setProjects] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const getProjects = () => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection("projects")
      .onSnapshot((snapshot) => {
        setProjects([]);
        setIsLoading(true);
        snapshot.forEach((doc) => {
          setProjects((projects) => projects.concat(doc.data()));
        });
        setIsLoading(false);
      });
    setIsLoading(false);
  };
  const control = 0;
  useEffect(() => {
    getProjects();
  }, [control]);

  const handleBackgroundText = (color) => {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 100) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  const addProject = () => {
    if (newProject.name === "") {
      return;
    }
    setIsLoading(true);
    firebase
      .firestore()
      .collection("projects")
      .add({
        name: newProject.name,
        color: newProject.color,
        id: "",
      })
      .then((newDoc) => {
        setAddNew(false);
        setNewProject({ name: "", color: "" });
        setIsLoading(false);
        firebase
          .firestore()
          .collection("projects")
          .doc(newDoc.id)
          .update({ id: newDoc.id });
      });
  };
  const listProjects = projects.map((project, id) => (
    <GridItem key={project.id} xs={12} sm={6} md={3}>
      <NavLink to={`/admin/pastas/${project.id}`}>
        <div
          style={{ backgroundColor: project.color ? project.color : "#FBCD00" }}
          className="project-card-wrapper-added"
        >
          <p style={{ color: handleBackgroundText(project.color) }}>
            {project.name}
          </p>
        </div>
      </NavLink>
    </GridItem>
  ));
  return (
    <>
      <div>
        {isLoading ? (
          <Loader
            type="MutatingDots"
            color="#fbcd00"
            secondaryColor="#F3F96E"
          />
        ) : (
          <GridContainer>
            {listProjects}
            {addNew ? (
              <div className="add-new-project-wrapper">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className="icon-limit-wrapper">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setAddNew(false);
                        setNewProject({
                          name: "",
                          color: "",
                        });
                      }}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </div>

                  <div
                    style={{
                      backgroundColor: newProject.color
                        ? newProject.color
                        : "#FBCD00",
                    }}
                    className="project-card-wrapper"
                  >
                    <input
                      style={{ color: handleBackgroundText(newProject.color) }}
                      value={newProject.name}
                      type="text"
                      className="project-card-wrapper-input"
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                    <input
                      type="color"
                      className="project-card-wrapper-input-color"
                      value={newProject.color ? newProject.color : "#fbcd00"}
                      onChange={(e) =>
                        setNewProject({ ...newProject, color: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => addProject()} color="primary">
                  Salvar
                </Button>
              </div>
            ) : (
              <div className="icon-limit-wrapper">
                <IconButton color="primary" onClick={() => setAddNew(true)}>
                  <AddIcon />
                </IconButton>
              </div>
            )}
          </GridContainer>
        )}
      </div>
    </>
  );
}
