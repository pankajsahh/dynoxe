import React, { PureComponent } from "react";
import "./index.scss";
import KEY from "../../utils/key";

class LogoutPopup extends PureComponent {
  constructor(props) {
    super(props);
    this.keyDownHandler = props.keyDownHandler;
    this.buttonRef = React.createRef();
  }

  componentDidMount() {
    if (this.buttonRef) {
      this.buttonRef?.current?.focus();
    }
  }

  componentDidUpdate() {
    if (this.buttonRef) {
      this.buttonRef?.current?.focus();
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
      <div className="logout-popup">
        <div className="wrapper">
          <div className="message">{this.props.message}</div>
          <ul
            className="btn"
            id="popup-action-btn"
            onKeyDown={this.keyDown}
            onClick={this.clickHandler}
            style={{ width: "64%" }}
          >
            {this.props.cancelBtn ? (
              <li tabindex="0" name="cancel" ref={this.buttonRef}>
                {this.props.cancelBtn}
              </li>
            ) : null}
            {this.props.okBtn ? (
              <li tabindex="0" name="done">
                {this.props.okBtn}
              </li>
            ) : null}
            {this.props.retry ? (
              <li tabindex="0" name="retry" ref={this.buttonRef}>
                {this.props.retry}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

export default LogoutPopup;
