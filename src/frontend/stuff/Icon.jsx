import classNames from "classnames";
import React from "react";
import "./Icon.css";

const Icon = props => {
  switch (props.name) {
    case "spinner":
      return (
        <svg className={classNames("spinner", "icon", {spin: props.spin})} enableBackground="new 0 0 497 497" viewBox="0 0 497 497" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="98" cy="376" fill="#909ba6" r="53"/>
            <circle cx="439" cy="336" fill="#c8d2dc" r="46"/>
            <circle cx="397" cy="112" fill="#e9edf1" r="38"/>
            <ellipse cx="56.245" cy="244.754" fill="#7e8b96" rx="56.245" ry="54.874"/>
            <ellipse cx="217.821" cy="447.175" fill="#a2abb8" rx="51.132" ry="49.825"/>
            <ellipse cx="349.229" cy="427.873" fill="#b9c3cd" rx="48.575" ry="47.297"/>
            <ellipse cx="117.092" cy="114.794" fill="#5f6c75" rx="58.801" ry="57.397"/>
            <ellipse cx="453.538" cy="216.477" fill="#dce6eb" rx="43.462" ry="42.656"/>
            <circle cx="263" cy="62" fill="#4e5a61" r="62"/>
          </g>
        </svg>
      );
    case "close":
        return (
          <svg className={classNames("close", "icon", {spin: props.spin})} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 492 492" xmlSpace="preserve">
            <g>
              <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
                c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
                c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
                L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
                c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
                c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
                c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
            </g>
          </svg>
        );
    default:
      return null;
  }
};

export default Icon;
