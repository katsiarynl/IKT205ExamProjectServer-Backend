import React, { useEffect, useReducer } from "react";

import { createContext } from "react";

//we were struggling to create a good context. therefore we asked the assistant for help during one of the ikt205 labs
//
//Extra resources: https://refine.dev/blog/usecontext-and-react-context/
//https://www.youtube.com/watch?v=5LrDIWkK_Bc&t=489s

const ACTIONS = {
  ADD_STUDENT: "add-student",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_STUDENT:
      console.log("The payload is");
      console.log(action.payload);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      return {
        ...state,

        stundets: action.payload,
      };
    //default is used  to return the state if no action is matched
    default:
      return state;
  }
};

const initialState = {
  stundets: [],
};

export const StudentContext = createContext();

function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Source: https://firebase.google.com/docs/database/web/read-and-write

    // onValue is called every time data is changed at the specified database reference
    //Source: https://firebase.google.com/docs/database/web/read-and-write

    // console.log("context stuff");

    const GETBlogs = fetch("http://10.0.0.9:5000/blogs");
    GETBlogs.then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
    });
    dispatch({
      type: ACTIONS.ADD_STUDENT,
      payload: GETBlogs || [],
    });
  }, []);

  return (
    <StudentContext.Provider value={{ state, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
}

export default StudentProvider;
