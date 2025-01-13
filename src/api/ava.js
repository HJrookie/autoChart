import axios from "axios";
// 
// http://localhost:4000/?wid=53c9d79c-b371-49f6-9ac6-8bbe42139897&cid=86329286-5b15-41eb-ab7a-e2089a9f0a7c

export const getSqlData = (wid, cid,count, roleName, serviceId) => axios({
    url: `${import.meta.env.VITE_APP_BASE_URL}/${wid}/${cid}/${count}/${roleName}/${serviceId}` ,
    // url: import.meta.env.VITE_APP_BASE_URL + '/' + wid + '/' + cid ,
// # VITE_APP_BASE_URL="http://8.155.16.135:18007/answer/53c9d79c-b371-49f6-9ac6-8bbe42139897/86329286-5b15-41eb-ab7a-e2089a9f0a7c"
    // "https://linghu-ai.com/v1/chat-messages",
    method: "get",
    // headers: {
    //     Authorization: import.meta.env.VITE_APP_BASE_AUTH,
    //     "Content-Type": "application/json",
    // },
    // data: {
    //     inputs: {},
    //     // query: query || "查询2018年到2023年项目的预算金额",
    //     query: query ,
    //     // query: query || "报到日期2017-05-02到30日的每天的总房价",
    //     response_mode: "blocking",
    //     conversation_id: "",
    //     user: "abc-123",
    // },
})
