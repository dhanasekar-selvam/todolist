export const initialstate = null;

export const reducer = (state, action) => {
    // switch(action.type){
    //     case "USER" :{
    //         return action.payload
    //     }
    //     case "CLEAR" :{
    //         return null;
    //     }
    //     default:{
    //         throw new Error();
    //     }

    // }
    if (action.type === "USER") {
        return action.payload
    }
    if (action.type === "CLEAR") {
        return null
    }

    return state

}

