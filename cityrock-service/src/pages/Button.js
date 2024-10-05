// Button.js
import React from "react";

function Button({ className, color, btn, click }) {
  return (
    <button className={className} style={{ backgroundColor: color }} onClick={click}>
      {btn}
    </button>
  );
}

export default Button;
