import React, { PureComponent } from "react";

import "./index.scss";

import KEY from "../../utils/key";

class Popup extends PureComponent {
  constructor(props) {
    super(props);
    this.keyDownHandler = props.keyDownHandler;
  }

  componentDidMount() {
    if (document.querySelector("#popup-action-btn")) {
      document.querySelector("#popup-action-btn li").focus();
    }
  }

  componentDidUpdate() {
    if (document.querySelector("#popup-action-btn")) {
      document.querySelector("#popup-action-btn li").focus();
    }
  }

  keyDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let key = e.keyCode;
    switch (key) {
      case KEY.LEFT:
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
        break;
      case KEY.RIGHT:
        if (e.target.nextSibling) {
          e.target.nextSibling.focus();
        }
        break;
      case KEY.ENTER:
        let name = e.target.getAttribute("name");
        this.props.keyDownHandler(name);
        break;
      case KEY.BACK:
        this.props.keyDownHandler("cancel");
        break;
    }
  };

  clickHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let name = e.target.getAttribute("name");
    this.keyDownHandler(name);
  };

  render() {
    return (
      <div className="exit-popup">
        <div className="wrapper">
          {this?.props?.title && <div className="title">{this?.props?.title}</div>}
          {this?.props?.message&& <div className="message">{this?.props?.message}</div>}
          <ul
            className="btn"
            id="popup-action-btn"
            style={this.props.style}
            onKeyDown={this.keyDown}
            onClick={this.clickHandler}
          >
            {this.props.cancelBtn ? (
              <li tabIndex="0" name="cancel">
                {this.props.cancelBtn}
              </li>
            ) : null}
            {this.props.okBtn ? (
              <li tabIndex="0" name="done">
                {this.props.okBtn}
              </li>
            ) : null}
            {this.props.retry ? (
              <li tabIndex="0" name="retry">
                {this.props.retry}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

export default Popup;
