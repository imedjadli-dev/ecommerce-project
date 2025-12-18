import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { Segment } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeProvider } from "styled-components";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);

  const theme = {
    headerTitle: "DropSell",
    background: "#f5f8fb",
    fontFamily: "Arial",
    headerBgColor: "#5c63af",
    headerFontColor: "#fb5c42",
    headerFontSize: "15px",
    botBubbleColor: "#5c63af",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  const steps = [
    { id: "Hello", message: "Welcome to DropSell", trigger: "Ask Name" },
    { id: "Ask Name", message: "Please enter your name", trigger: "waiting" },
    { id: "waiting", user: true, trigger: "Name" },
    {
      id: "Name",
      message: "Hi {previousValue}, Can I help you with anything?",
      trigger: "Issues",
    },
    {
      id: "Issues",
      options: [
        { value: 0, label: "No", trigger: "bye" },
        { value: 1, label: "Account information", trigger: "accountInfo" },
        { value: 2, label: "Order information", trigger: "orderInfo" },
        { value: 3, label: "Shipping information", trigger: "shippingInfo" },
        { value: 4, label: "Payment methods", trigger: "paymentInfo" },
        { value: 5, label: "Contact support", trigger: "contactSupport" },
      ],
    },
    {
      id: "bye",
      message: "Have a nice day, and thank you for choosing DropSell.",
      end: true,
    },
    {
      id: "paymentInfo",
      message: "Currently we only accept payment upon delivery.",
      end: true,
    },
    {
      id: "contactSupport",
      message: "Reach support at support@example.com or call +216 XX XXX XXX.",
      end: true,
    },
    {
      id: "accountInfo",
      options: [
        { value: 1, label: "How to register", trigger: "howToRegister" },
        {
          value: 2,
          label: "How to reset password",
          trigger: "howToResetPassword",
        },
      ],
    },
    {
      id: "howToRegister",
      message:
        "Go to Account > Create a free account, fill in the info, and submit.",
      end: true,
    },
    {
      id: "howToResetPassword",
      message:
        "Click 'Forgot Password?' on Account page and follow instructions.",
      end: true,
    },
    {
      id: "shippingInfo",
      options: [
        { value: 1, label: "Shipping time", trigger: "shippingTime" },
        { value: 2, label: "Shipping cost", trigger: "shippingCost" },
      ],
    },
    {
      id: "shippingTime",
      message: "Shipping takes 3-7 days depending on location.",
      end: true,
    },
    {
      id: "shippingCost",
      message: "Orders <300DT: 7DT shipping. Orders >=300DT: free shipping.",
      end: true,
    },
    {
      id: "orderInfo",
      options: [
        { value: 1, label: "Track order", trigger: "orderTrack" },
        { value: 2, label: "Apply discount", trigger: "orderDiscount" },
        { value: 3, label: "Cancel order", trigger: "orderCancelled" },
      ],
    },
    {
      id: "orderTrack",
      message: "Track orders on your account's Orders page.",
      end: true,
    },
    {
      id: "orderDiscount",
      message: "Discount codes available on our social media platforms.",
      end: true,
    },
    {
      id: "orderCancelled",
      message: "Cancel before shipping. Contact support immediately.",
      end: true,
    },
  ];

  const toggleChatbot = () => setShowChatbot((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      {showChatbot && (
        <Segment
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            width: "350px",
            maxWidth: "90%",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            padding: "10px",
          }}
        >
          <ChatBot steps={steps} />
          <FontAwesomeIcon
            icon={faRobot}
            onClick={toggleChatbot}
            title="Close Chatbot"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              fontSize: "18px",
              color: "#fb5c42",
            }}
          />
        </Segment>
      )}
      {!showChatbot && (
        <FontAwesomeIcon
          icon={faRobot}
          onClick={toggleChatbot}
          title="Open Chatbot"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            fontSize: "24px",
            color: "#5c63af",
            cursor: "pointer",
          }}
        />
      )}
    </ThemeProvider>
  );
}

export default Chatbot;
