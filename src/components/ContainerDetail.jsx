import React from "react";
import Left from "../animated-components/Left";

export const ContainerDetails = ({ container }) => {
  return (
    <Left>
      <h4 className="text-md mb-2">Cargo Items</h4>
      {container.cargoItems.length === 0 ? (
        <p>No cargo items inside this container.</p>
      ) : (
        // container.cargoItems.map((item) => (
        //   <div key={item.id} className="border-t pt-2 mt-2">
        //     <p>Item: {item.name}</p>
        //     <p>
        //       Dimensions: {item.length} x {item.breadth} x {item.height}
        //     </p>
        //   </div>
        // ))
      <p>no of cargos</p>
      )
      }
    </Left>
  );
};
