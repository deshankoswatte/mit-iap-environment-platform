import React, { Fragment, useContext, useEffect, useState } from "react";
import { AdminRequestContext } from "../../../../../utility/contexts/admin_request_context";
import "./request_info.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import Avatar from "../../../../../../asserts/images/avatar.png";
import { Map, TileLayer, Polygon } from "react-leaflet";

const AdminView = () => {
  const [
    id,
    title,
    status,
    body,
    owner,
    tags,
    assignees,
    ,
    ,
    setStatus,
    ,
    ,
    setAssignees
  ] = useContext(AdminRequestContext);
  const [loading] = useState(null);
  let history = useHistory();
  const [data, setData] = useState(null);
  const [collaborators, setCollaborators] = useState(null);
  const [comments, setComments] = useState(null);
  const [reply, setReply] = useState("");
  const [labels, setLabels] = useState(null);
  const [state, setState] = useState();
  const [tempAssignee, setTempAssignee] = useState();
  const [newState, setNewState] = useState("");
  const pending = "Pending";
  const noOne = "No Authority";

  const wait = ms => {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  };

  const handleSubmit = event => {
    axios
      .post("http://0.0.0.0:9070/admin-services/post-comment/" + id, {
        body: reply
      })
      .then(response => {
        setReply("");
        console.log(response.data);
        wait(3000);
        axios
          .get("http://0.0.0.0:9080/user-services/get-comments/" + id)
          .then(response => {
            setComments(response.data);
            setData(JSON.parse(body));
            console.log(response.data);
          })
          .catch();
      })
      .catch();
  };

  const getLabels = () => {
    axios
      .get("http://0.0.0.0:9070/admin-services/get-all-labels")
      .then(response => {
        console.log(response.data);
        setLabels(response.data);
      })
      .catch();
  };

  const removeLabel = () => {
    axios
      .delete(
        "http://0.0.0.0:9070/admin-services/remove-label/" + id + "/" + status
      )
      .then(response => {
        console.log(response);
      })
      .catch();
  };

  const getComments = () => {
    axios
      .get("http://0.0.0.0:9070/admin-services/get-comments/" + id)
      .then(response => {
        setComments(response.data);
        setData(JSON.parse(body));
        console.log(response.data);
      })
      .catch();
  };

  const getCollaborators = () => {
    axios
      .get("http://0.0.0.0:9070/admin-services/get-all-collaborators")
      .then(response => {
        setCollaborators(response.data);
        console.log(response.data);
      })
      .catch();
  };

  const assignLabel = val => {
    axios
      .post("http://0.0.0.0:9070/admin-services/assign-label/" + id, {
        labelNames: [val]
      })
      .then(response => {
        console.log(response);
      })
      .catch();
  };

  const assignAssignee = val => {
    axios
      .post("http://0.0.0.0:9070/admin-services/add-assignees/" + id, {
        assignees: [val]
      })
      .then(response => {
        console.log(response.data);
      })
      .catch();
  };

  const changeState = () => {
    if (status !== "") {
      removeLabel();
    }
    if (state !== undefined) {
      assignLabel(state);
      setStatus(state);
    }
  };

  const changeTempAssginee = () => {
    if (tempAssignee !== undefined) {
      console.log(tempAssignee);
      setAssignees([tempAssignee]);
      assignAssignee(tempAssignee);
    }
  };

  useEffect(() => {
    console.log(assignees);
    getComments();
    getLabels();
    getCollaborators();
  }, [loading, id]);

  const createNewLabel = () => {
    axios
      .post("http://0.0.0.0:9070/admin-services/create-label", {
        labelName: newState,
        labelDescription: "state"
      })
      .then(response => {
        console.log(response);
      })
      .catch();
  };

  return (
    <Fragment>
      <br />
      <button
        className="btn btn-info request-button"
        onClick={() => {
          history.goBack();
        }}
      >
        Back
      </button>
      <div className="row request-div">
        <div className="col-sm-8 ">
          <div className="card">
            <div className="card-header">
              <h1> {title}</h1>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-sm-10">
                  <h3>Authorities of the Request:</h3>
                  <ul>
                    {assignees !== null ? (
                      assignees.length !== 0 ? (
                        assignees.map(assignee => <li>{assignee}</li>)
                      ) : tempAssignee !== undefined ? null : (
                        <p>{noOne}</p>
                      )
                    ) : (
                      pending
                    )}
                    {tempAssignee !== undefined ? (
                      <li>{tempAssignee}</li>
                    ) : (
                      <p></p>
                    )}
                  </ul>
                </div>
                <div className="col-sm-2 ">
                  <div
                    class="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-info"
                      data-toggle="modal"
                      data-target="#myModal3"
                    >
                      Add assignees
                    </button>
                  </div>
                </div>
                <div className="modal" id="myModal3">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                        >
                          &times;
                        </button>
                        <h3>Add Authority</h3>
                        <hr />
                        <div className="form-group">
                          <label>Available authority:</label>
                          <select
                            className="form-control"
                            value={tempAssignee}
                            onChange={event =>
                              setTempAssignee(event.target.value)
                            }
                          >
                            {collaborators != null
                              ? collaborators.map(assignee => (
                                  <option
                                    key={assignee.id}
                                    value={assignee.name}
                                  >
                                    {assignee.name}
                                  </option>
                                ))
                              : null}
                          </select>
                          <br />
                          <button
                            onClick={() => changeTempAssginee()}
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row ">
                <div className="col-sm-10">
                  <h3>
                    Status of the Request: {status !== "" ? status : pending}
                  </h3>
                </div>
                <div className="col-sm-2 ">
                  <div
                    class="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-info"
                      data-toggle="modal"
                      data-target="#myModal"
                    >
                      Change State
                    </button>
                  </div>

                  <div className="modal" id="myModal">
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                          >
                            &times;
                          </button>
                          <h3>Change State</h3>
                          <hr />
                          <div className="form-group">
                            <label>Select list:</label>
                            <select
                              className="form-control"
                              value={state}
                              onChange={event => setState(event.target.value)}
                            >
                              {labels != null
                                ? labels.map(label => (
                                    <option
                                      key={label.labelName}
                                      value={label.labelName}
                                    >
                                      {label.labelName}
                                    </option>
                                  ))
                                : null}
                            </select>
                            <br />
                            <button
                              onClick={() => changeState()}
                              type="submit"
                              className="btn btn-primary"
                              data-dismiss="modal"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal fade" id="myModal2">
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                          >
                            &times;
                          </button>
                          <form className="was-validated">
                            <div className="form-group">
                              <label>State Name:</label>
                              <input
                                type="text"
                                className="form-control"
                                id="uname"
                                placeholder="Enter state name"
                                name="uname"
                                value={newState}
                                onChange={event => {
                                  setNewState(event.target.value);
                                }}
                                required
                              />
                              <div className="valid-feedback">Valid.</div>
                              <div className="invalid-feedback">
                                Please fill out this field.
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                createNewLabel();
                              }}
                              type="button"
                              className="btn btn-primary"
                              data-dismiss="modal"
                            >
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {data != null ? (
                <div>
                  <h3>Description : {data.description}</h3>
                  <h3>Duration : {data.timeframe}</h3>
                  <h3>Place</h3>
                  <Map
                    style={{ height: "480px", width: "100%" }}
                    //zoomed to center on given coords
                    bounds={data.points}
                  >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polygon //blue polygon for given coords
                      positions={data.points}
                    />
                  </Map>
                </div>
              ) : (
                <p>Please wait</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-4 ">
          <Comment.Group size="large">
            <Header as="h3" dividing>
              Process of the Request
            </Header>
            {comments != null ? (
              comments.map(comment => (
                <Comment key={comment.commentId}>
                  <Comment.Avatar
                    src={Avatar}
                    alt="WSO2"
                    width="40"
                    height="40"
                  />
                  <Comment.Content>
                    <Comment.Author as="a">{comment.user}</Comment.Author>
                    <Comment.Text>{comment.comment}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              ))
            ) : (
              <h3>no</h3>
            )}
            <br />
            <Form>
              <Form.Field>
                <input
                  type="text"
                  value={reply}
                  onChange={event => setReply(event.target.value)}
                />
              </Form.Field>
              <Button
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                primary
                onClick={() => handleSubmit()}
              />
            </Form>
          </Comment.Group>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminView;
