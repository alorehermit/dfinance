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
    case "copy":
      return (
        <svg viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path d="m186.667969 416c-49.984375 0-90.667969-40.683594-90.667969-90.667969v-218.664062h-37.332031c-32.363281 0-58.667969 26.300781-58.667969 58.664062v288c0 32.363281 26.304688 58.667969 58.667969 58.667969h266.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969v-37.332031zm0 0"/>
          <path d="m469.332031 58.667969c0-32.40625-26.261719-58.667969-58.664062-58.667969h-224c-32.40625 0-58.667969 26.261719-58.667969 58.667969v266.664062c0 32.40625 26.261719 58.667969 58.667969 58.667969h224c32.402343 0 58.664062-26.261719 58.664062-58.667969zm0 0"/>
        </svg>
      );
    case "check-alt":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <circle id="??????_14" data-name="?????? 14" cx="16" cy="16" r="16" fill="#3cad87"/>
          <g id="???_63" data-name="??? 63" transform="translate(6 10)">
            <path id="??????_70" data-name="?????? 70" d="M2440.064,3214.457h0a1.415,1.415,0,0,1-1-.416l-6.64-6.64a1.416,1.416,0,0,1,2-2l5.639,5.639,9.927-9.926a1.416,1.416,0,0,1,2,2l-10.928,10.928A1.415,1.415,0,0,1,2440.064,3214.457Z" transform="translate(-2432.009 -3200.697)" fill="#efefef"/>
          </g>
        </svg>
      );
    case "export":
      return (
        <svg viewBox="0 -22 512 511" xmlns="http://www.w3.org/2000/svg">
          <path d="m512 233.820312-212.777344-233.320312v139.203125h-45.238281c-140.273437 0-253.984375 113.710937-253.984375 253.984375v73.769531l20.09375-22.019531c68.316406-74.851562 164.980469-117.5 266.324219-117.5h12.804687v139.203125zm0 0"/>
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
