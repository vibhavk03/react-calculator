import { useReducer } from "react";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    // add digits to the calculator output
    case ACTIONS.ADD_DIGIT:
      // handle edge cases
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // if pressing decimal on empty display
      if (payload.digit === "." && state.currentOperand == null) {
        return state;
      }
      // can not add multiple zeros
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      // can only add decimal once
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      // console.log("AFTER: ADD DIGIT", state);
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    // clear calculator display
    case ACTIONS.CLEAR:
      // return empty state
      return {};

    // do any operation in calculator
    case ACTIONS.CHOOSE_OPERATION:
      // console.log("in choose operation", state);

      // if no numbers in the calculator
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      // if first time operation button clicked
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      // if we click operation button twice in a row so only update the operation in state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      // we evaluate the operation stored before returning new state
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      // if we dont have enough information
      if (
        state.previousOperand == null ||
        state.operation == null ||
        state.currentOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      console.log();
      // if overwrite is true
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      // if nothing in the display then return state as it is
      if (state.currentOperand == null) {
        return state;
      }
      // if deleting one digit then set current operand as null
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      // default case
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    default:
      return state;
  }
}

function evaluate(state) {
  const { previousOperand, currentOperand, operation } = state;
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  // if not a number value then return empty
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;

    case "-":
      computation = prev - curr;
      break;

    case "*":
      computation = prev * curr;
      break;

    case "÷":
      computation = prev / curr;
      break;

    default:
      break;
  }

  // convert to string
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  // only format integer if decimal is null
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  // return string with integer and decimal
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // console.log("rendering", { currentOperand, previousOperand, operation });

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
