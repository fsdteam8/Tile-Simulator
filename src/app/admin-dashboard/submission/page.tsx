import React from "react";
// import AllSubmissionContainer from "./_components/AllSubmissinContainer";
const AllSubmissionContainer = dynamic(() => import("./_components/AllSubmissinContainer"), {
  ssr: false,
});
import AllSubmissionHeader from "./_components/AllSubmissionHeader";
import dynamic from "next/dynamic";

const Submission = () => {
  return (
    <div>
      <AllSubmissionHeader />
      <AllSubmissionContainer />
    </div>
  );
};

export default Submission;
