import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const MyCard = () => {
  // Example data for cards
  const cardsData = [
    { title: "Card 1", content: "This is the first card." },
    { title: "Card 2", content: "This is the second card." },
    { title: "Card 3", content: "This is the third card." },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {cardsData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          style={{
            width: "30rem",
            marginTop: "2rem",
            marginLeft: "1rem",
            marginRight: "1rem",
          }}
        >
          <p>{card.content}</p>
          <Button label="Action" icon="pi pi-check" className="p-button-sm" />
        </Card>
      ))}
    </div>
  );
};

export default MyCard;
