import React from 'react';

const TitleComponent = ({ title }) => {
  return (
    <div className="flex justify-center items-center h-16">
      

      <h2 className="text-2xl font-bold text-center">{title} </h2>
    </div>
  );
};

export default TitleComponent;
